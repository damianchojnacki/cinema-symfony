<?php

// api/src/EventSubscriber/BookMailSubscriber.php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Reservation;
use App\Service\FrontendUrlGenerator;
use chillerlan\QRCode\QRCode;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

final readonly class ReservationCreateSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private MailerInterface $mailer,
        private FrontendUrlGenerator $frontendUrlGenerator,
        private UrlGeneratorInterface $urlGenerator,
        private HubInterface $mercure,
        private SerializerInterface $serializer,
    ) {}

    /**
     * @return array<string, array<int, int|string>>
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['handleCreate', EventPriorities::POST_WRITE],
        ];
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function handleCreate(ViewEvent $event): void
    {
        $reservation = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (! $reservation instanceof Reservation || $method !== Request::METHOD_POST) {
            return;
        }

        $this->publishMercureTopic($reservation);

        $this->sendMail($reservation);
    }

    private function publishMercureTopic(Reservation $reservation): void
    {
        $url = $this->urlGenerator->generate('_api_/showings/{id}_get', [
            'id' => $reservation->showing->getId(),
        ], UrlGeneratorInterface::ABSOLUTE_URL);

        $reservation->showing->reservations->add($reservation);

        $data = $this->serializer->serialize($reservation->showing, 'jsonld');

        $update = new Update($url, $data);

        $this->mercure->publish($update);
    }

    /**
     * @throws TransportExceptionInterface
     */
    private function sendMail(Reservation $reservation): void
    {
        $url = $this->frontendUrlGenerator->reservation($reservation);

        $qrcode = (new QRCode)->render($url);
        $time = $reservation->showing->starts_at->format('r');
        $seats = json_encode($reservation->seats);

        $message = (new Email)
            ->from('admin@example.com')
            ->to($reservation->email)
            ->subject('Your reservation')
            ->html(<<<HTML
            <p>The reservation has been placed.</p>
            <p>Movie: {$reservation->showing->movie->title}</p>
            <p>Time: $time</p>
            <p>Seats: $seats</p>
            <p>Please show QR Code below to the cinema staff:</p>
            <img src="$qrcode" alt="QR Code" height="360" width="360" style="margin: 0 auto;"/>
            <p>Thank you for choosing us!</p>
            HTML);

        $this->mailer->send($message);
    }
}
