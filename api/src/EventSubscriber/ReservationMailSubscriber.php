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
use Symfony\Component\Mime\Email;

final class ReservationMailSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly FrontendUrlGenerator $urlGenerator,
    ) {}

    /**
     * @return array<string, array<int, int|string>>
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['sendMail', EventPriorities::POST_WRITE],
        ];
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function sendMail(ViewEvent $event): void
    {
        $reservation = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (! $reservation instanceof Reservation || $method !== Request::METHOD_POST) {
            return;
        }

        $url = $this->urlGenerator->reservation($reservation);

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
