<?php

namespace App\Serializer;

use App\Entity\Movie;
use App\Service\FrontendUrlGenerator;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class MovieNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly FrontendUrlGenerator $urlGenerator) {}

    /**
     * @return array<mixed>|\ArrayObject<(int|string), mixed>|bool|float|int|string|null
     * @throws ExceptionInterface
     */
    public function normalize(mixed $object, ?string $format = null, array $context = []): array|\ArrayObject|bool|float|int|string|null
    {
        $object->poster_url = $this->urlGenerator->path($object->poster_path);
        $object->backdrop_url = $this->urlGenerator->path($object->backdrop_path);

        return $this->normalizer->normalize($object, $format, [self::class => true] + $context);
    }

    /**
     * @param array<string, bool> $context
     */
    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Movie && !isset($context[self::class]);
    }

    /**
     * @return array<string, bool>
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            Movie::class => false,
        ];
    }
}
