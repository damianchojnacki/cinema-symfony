<?php

namespace App\Tests\Feature;

use App\Command\MoviesImportCommand;
use App\Entity\Movie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\JsonMockResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MoviesImportCommandTest extends KernelTestCase
{
    public function test_import_movies(): void
    {
        self::bootKernel();

        $container = static::getContainer();

        $responses = [
            new JsonMockResponse($data = json_decode(file_get_contents(__DIR__ . '/../fixtures/movies.json') ?: '', true)),
        ];

        $client = new MockHttpClient($responses);

        $container->set(HttpClientInterface::class, $client);

        $application = new Application(self::$kernel);

        $command = $application->find(MoviesImportCommand::getDefaultName());
        $commandTester = new CommandTester($command);
        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();

        $movies = $container->get(EntityManagerInterface::class)->getRepository(Movie::class)->findAll();

        $this->assertCount(2, $movies);

        $this->assertEquals($data['results'][0]['title'], $movies[0]->title);
    }
}
