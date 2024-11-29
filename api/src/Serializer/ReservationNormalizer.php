<?php

namespace App\Serializer;

use App\Entity\Reservation;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ReservationNormalizer implements NormalizerAwareInterface, NormalizerInterface
{
    use NormalizerAwareTrait;

    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {}

    /**
     * @return array<mixed>|\ArrayObject<(int|string), mixed>|bool|float|int|string|null
     *
     * @throws ExceptionInterface
     */
    public function normalize(mixed $object, ?string $format = null, array $context = []): array|\ArrayObject|bool|float|int|string|null
    {
        $object->qr_url = $this->urlGenerator->generate('reservations_qr_show', [
            'token' => $object->token,
        ], UrlGeneratorInterface::ABSOLUTE_URL);

        return $this->normalizer->normalize($object, $format, [self::class => true] + $context);
    }

    /**
     * @param  array<string, bool>  $context
     */
    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Reservation && ! isset($context[self::class]);
    }

    /**
     * @return array<string, bool>
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            Reservation::class => false,
        ];
    }
}
