<?php

namespace App\Serializer;

use App\Entity\Movie;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class MovieNormalizer implements NormalizerAwareInterface, NormalizerInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly UrlGeneratorInterface $urlGenerator) {}

    /**
     * @return array<mixed>|\ArrayObject<(int|string), mixed>|bool|float|int|string|null
     *
     * @throws ExceptionInterface
     */
    public function normalize(mixed $object, ?string $format = null, array $context = []): array|\ArrayObject|bool|float|int|string|null
    {
        $object->poster_url = $this->urlGenerator->generate('image_show', [
            'path' => $object->poster_path,
        ], UrlGeneratorInterface::ABSOLUTE_URL);

        $object->backdrop_url = $this->urlGenerator->generate('image_show', [
            'path' => $object->backdrop_path,
        ], UrlGeneratorInterface::ABSOLUTE_URL);

        return $this->normalizer->normalize($object, $format, [self::class => true] + $context);
    }

    /**
     * @param  array<string, bool>  $context
     */
    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Movie && ! isset($context[self::class]);
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
