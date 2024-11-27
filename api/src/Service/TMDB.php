<?php

namespace App\Service;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\DecoderInterface;
use Symfony\Contracts\HttpClient\Exception\HttpExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class TMDB
{
    protected static string $baseUrl = 'https://api.themoviedb.org/3/';

    protected static string $imageUrl = 'https://image.tmdb.org/t/p/';

    public function __construct(
        private readonly string $apiKey,
        private readonly DecoderInterface $decoder,
        private readonly HttpClientInterface $client,
    ) {}

    /**
     * @return mixed[]
     *
     * @throws HttpExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function request(string $path): array
    {
        return $this->decoder->decode($this->client->request(Request::METHOD_GET, static::$baseUrl . $path, [
            'headers' => [
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $this->apiKey,
            ],
        ])->getContent(), 'json');
    }

    /**
     * @return ArrayCollection<int, array<string, mixed>>
     *
     * @throws HttpExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function movies(): ArrayCollection
    {
        return new ArrayCollection($this->request('discover/movie?sort_by=popularity.desc')['results']);
    }

    public function image(string $path, string $size = 'original'): string
    {
        $image = file_get_contents(static::$imageUrl . "$size/$path");

        if (! $image) {
            throw new FileException('Could not read image.');
        }

        return $image;
    }
}
