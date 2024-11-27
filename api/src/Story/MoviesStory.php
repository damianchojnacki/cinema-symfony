<?php

namespace App\Story;

use App\Command\MoviesImportCommand;
use App\Factory\MovieFactory;
use App\Factory\ReservationFactory;
use App\Factory\ShowingFactory;
use App\Utils\Storage;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpKernel\KernelInterface;
use Zenstruck\Foundry\Story;

final class MoviesStory extends Story
{
    public function __construct(
        private readonly Storage $storage,
        private readonly KernelInterface $kernel
    ) {}

    public function build(): void
    {
        $filesystem = new Filesystem;

        $filesystem->remove($this->storage->path());

        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $application->run(
            new ArrayInput(['command' => MoviesImportCommand::getDefaultName()]),
            new NullOutput
        );
        //MovieFactory::createMany(20);

        ShowingFactory::createMany(100, function () {
            return ['movie' => MovieFactory::random()];
        });

        ReservationFactory::createMany(100, function () {
            return ['showing' => ShowingFactory::random()];
        });
    }
}
