<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Movie;
use App\Factory\MovieFactory;
use App\Service\FrontendUrlGenerator;
use App\Service\Storage;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class MovieTest extends ApiTestCase
{
    use Factories, ResetDatabase;

    protected Storage $storage;

    protected FrontendUrlGenerator $urlGenerator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storage = self::getContainer()->get(Storage::class);
        $this->storage->fake();

        $this->urlGenerator = self::getContainer()->get(FrontendUrlGenerator::class);
    }

    public function test_list_movies(): void
    {
        MovieFactory::new()
            ->withFakeImages()
            ->createMany(20);

        $response = static::createClient()->request('GET', '/movies');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Movie',
            '@type' => 'Collection',
            'totalItems' => 20,
        ]);

        $this->assertCount(12, $response->toArray()['member']);
        $this->assertMatchesResourceCollectionJsonSchema(Movie::class);
    }

    public function test_shows_movie(): void
    {
        $movie = MovieFactory::new()
            ->withFakeImages()
            ->createOne();

        static::createClient()->request('GET', '/movies/' . $movie->getId());

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Movie',
            '@type' => 'Movie',
            'id' => $movie->getId(),
            'title' => $movie->title,
            'description' => $movie->description,
            'rating' => $movie->rating,
            'poster_url' => $this->urlGenerator->path($movie->poster_path),
            'backdrop_url' => $this->urlGenerator->path($movie->backdrop_path),
        ]);
        $this->assertMatchesResourceItemJsonSchema(Movie::class);
    }
}
