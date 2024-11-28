<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Response;
use App\Entity\Reservation;
use App\Factory\MovieFactory;
use App\Factory\ReservationFactory;
use App\Factory\ShowingFactory;
use App\Service\Storage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ReservationTest extends ApiTestCase
{
    use Factories, ResetDatabase;

    protected Storage $storage;

    protected EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storage = self::getContainer()->get(Storage::class);
        $this->entityManager = self::getContainer()->get(EntityManagerInterface::class);
    }

    public function test_creates_reservation_and_sends_email(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        $showing = ShowingFactory::createOne([
            'movie' => $movie,
        ]);

        // why is this not working?
        static::createClient()->request('POST', '/showings/' . $showing->getId() . '/reservations', [
            'json' => [
                'email' => $email = 'user@example.com',
                'seats' => $seats = [[0, 1]],
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Reservation',
            '@type' => 'Reservation',
            'total' => number_format(count($seats) * 9, 2),
            'email' => $email,
            'seats' => $seats,
        ]);
        $this->assertMatchesResourceItemJsonSchema(Reservation::class);

        $this->assertEmailCount(1);

        $message = $this->getMailerMessage();

        $this->assertEmailHeaderSame($message, 'To', $email);
        $this->assertEmailHtmlBodyContains($message, 'The reservation has been placed.');
    }

    public function test_calculates_total_from_seats_count(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        $showing = ShowingFactory::createOne([
            'movie' => $movie,
        ]);

        // why is this not working?
        static::createClient()->request('POST', '/showings/' . $showing->getId() . '/reservations', [
            'json' => [
                'email' => 'user@example.com',
                'seats' => $seats = [[0, 1]],
                'total' => 1,
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Reservation',
            '@type' => 'Reservation',
            'total' => number_format(count($seats) * 9, 2),
        ]);
        $this->assertMatchesResourceItemJsonSchema(Reservation::class);
    }

    public function test_generates_random_token(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        $showing = ShowingFactory::createOne([
            'movie' => $movie,
        ]);

        // why is this not working?
        $response = static::createClient()->request('POST', '/showings/' . $showing->getId() . '/reservations', [
            'json' => [
                'email' => 'user@example.com',
                'seats' => [[0, 1]],
                'token' => $token = '123',
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $id = $response->toArray()['id'];

        $this->assertNotNull($id);

        $reservation = $this->entityManager->getRepository(Reservation::class)->find($id);

        $this->assertNotNull($reservation);

        $this->assertNotEquals($token, $reservation->token);
    }

    public function test_validates_invalid_seats(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        $showing = ShowingFactory::createOne([
            'movie' => $movie,
        ]);

        // why is this not working?
        static::createClient()->request('POST', '/showings/' . $showing->getId() . '/reservations', [
            'json' => [
                'email' => 'user@example.com',
                'seats' => [[99, 99]],
            ],
        ]);

        $this->assertResponseIsUnprocessable();
        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'violations' => [
                [
                    'message' => 'The seats are invalid.',
                ],
            ],
        ]);

        $this->assertEmailCount(0);
    }

    public function test_validates_taken_seats(): void
    {
        $this->storage->fake();

        $movie = MovieFactory::new()
            ->withFakeImages()
            ->create();

        $showing = ShowingFactory::createOne([
            'movie' => $movie,
        ]);

        $reservation = ReservationFactory::createOne(['showing' => $showing]);

        // why is this not working?
        static::createClient()->request('POST', '/showings/' . $showing->getId() . '/reservations', [
            'json' => [
                'email' => 'user@example.com',
                'seats' => $reservation->seats,
            ],
        ]);

        $this->assertResponseIsUnprocessable();
        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'violations' => [
                [
                    'message' => 'The seats are already taken.',
                ],
            ],
        ]);

        $this->assertEmailCount(0);
    }
}
