<?php

namespace App\Command;

use App\Entity\Movie;
use App\Service\TMDB;
use App\Utils\Storage;
use Carbon\Carbon;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[AsCommand(
    name: 'app:movies:import',
    description: 'Import movies from TMDB.',
)]
class MoviesImportCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly Storage $storage,
        private readonly TMDB $tmdb,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $movies = $this->tmdb->movies();

        $io->progressStart($movies->count());

        $movies->map(function (array $movie) use ($io) {
            $entity = new Movie;

            $entity->title = $movie['title'];
            $entity->description = $movie['overview'];
            $entity->rating = $movie['vote_average'];
            $entity->popularity = (int) $movie['popularity'];
            $entity->release_date = Carbon::createFromFormat('Y-m-d', $movie['release_date'])->toDateTimeImmutable();
            $entity->poster_path = $this->saveImage($movie['title'], $this->tmdb->image($movie['poster_path']), 'posters');
            $entity->backdrop_path = $this->saveImage($movie['title'], $this->tmdb->image($movie['backdrop_path']), 'backdrops');

            $this->entityManager->persist($entity);

            $io->progressAdvance();
        });

        $this->entityManager->flush();

        $io->progressFinish();

        $io->table(['Title'], $movies->map(fn (array $movie) => [$movie['title']])->toArray());

        $io->success('Successfully imported ' . $movies->count() . ' movies.');

        return Command::SUCCESS;
    }

    private function saveImage(string $title, string $imageContent, string $directory): string
    {
        $filesystem = new Filesystem;
        $slugger = new AsciiSlugger;

        $path = $this->storage->path() . "$directory/" . strtolower($slugger->slug($title)) . '.jpg';

        $filesystem->dumpFile($path, $imageContent);

        return $path;
    }
}
