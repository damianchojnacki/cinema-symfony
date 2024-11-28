<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Showing;
use App\Factory\MovieFactory;
use App\Factory\ReservationFactory;
use App\Factory\ShowingFactory;
use App\Service\Storage;
use Carbon\Carbon;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ShowingTest extends ApiTestCase
{
    use Factories, ResetDatabase;

    protected Storage $storage;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storage = self::getContainer()->get(Storage::class);
    }

    public function test_list_showings(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        ShowingFactory::createMany(10, [
            'movie' => $movie,
        ]);

        $response = static::createClient()->request('GET', '/movies/' . $movie->getId() . '/showings');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Showing',
            '@type' => 'Collection',
            'totalItems' => 10,
        ]);

        $this->assertCount(10, $response->toArray()['member']);
        $this->assertMatchesResourceCollectionJsonSchema(Showing::class);
    }

    public function test_list_only_future_showings(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        ShowingFactory::createMany(3, [
            'movie' => $movie,
        ]);

        ShowingFactory::createMany(3, [
            'movie' => $movie,
            'starts_at' => Carbon::now()->subDays(rand(1, 3))->toDateTimeImmutable(),
        ]);

        $response = static::createClient()->request('GET', '/movies/' . $movie->getId() . '/showings');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Showing',
            '@type' => 'Collection',
            'totalItems' => 3,
        ]);

        $this->assertCount(3, $response->toArray()['member']);
        $this->assertMatchesResourceCollectionJsonSchema(Showing::class);
    }

    public function test_shows_movie(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        $showing = ShowingFactory::createOne([
            'movie' => $movie,
        ]);

        ReservationFactory::createMany(3, function () use ($showing) {
            return ['showing' => $showing];
        });

        static::createClient()->request('GET', '/showings/' . $showing->getId());

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Showing',
            '@type' => 'Showing',
            'id' => $showing->getId(),
            'rows' => $showing->rows,
            'columns' => $showing->columns,
            'starts_at' => $showing->starts_at->format('c'),
            'seats_taken' => $showing->getSeatsTaken(),
        ]);
        $this->assertMatchesResourceItemJsonSchema(Showing::class);
    }
}
