<?php

namespace App\Tests\Feature;

use App\Service\TMDB;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\JsonMockResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class TMDBTest extends KernelTestCase
{
    public function test_gets_movies(): void
    {
        self::bootKernel();

        $container = static::getContainer();

        $responses = [
            new JsonMockResponse($data = json_decode(file_get_contents(__DIR__ . '/../fixtures/movies.json') ?: '', true)),
        ];

        $client = new MockHttpClient($responses);

        $container->set(HttpClientInterface::class, $client);

        $tmdb = $container->get(TMDB::class);

        $movies = $tmdb->movies();

        $this->assertEquals(2, $movies->count());

        $this->assertEquals($data['results'][0], $movies[0]);
        $this->assertEquals($data['results'][1], $movies[1]);
    }
}
