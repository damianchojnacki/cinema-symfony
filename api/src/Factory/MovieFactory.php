<?php

namespace App\Factory;

use App\Entity\Movie;
use App\Service\FakeFile;
use App\Service\Storage;
use Carbon\Carbon;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Movie>
 */
final class MovieFactory extends PersistentProxyObjectFactory
{
    /** @phpstan-ignore-next-line  */
    protected static bool $usesFakeImages = false;

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct(protected Storage $storage)
    {
        parent::__construct();
    }

    public static function class(): string
    {
        return Movie::class;
    }

    /**
     * @return array<string, mixed>
     */
    protected function defaults(): array
    {
        return [
            'title' => self::faker()->sentence(3),
            'description' => self::faker()->paragraph(4),
            'release_date' => Carbon::now()->subDays(rand(1, 30))->toDateTimeImmutable(),
            'rating' => self::faker()->randomFloat(1, 0, 9.9),
            'popularity' => rand(0, 1000),
        ];
    }

    public function withFakeImages(): self
    {
        self::$usesFakeImages = true;

        return $this;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this->afterInstantiate(function (Movie $movie) {
            $movie->poster_path = $this->saveImage(
                $movie->title,
                self::$usesFakeImages ? FakeFile::image('poster.jpg')->getContent() : (file_get_contents('https://picsum.photos/600/800') ?: ''),
                'posters'
            );

            $movie->backdrop_path = $this->saveImage(
                $movie->title,
                self::$usesFakeImages ? FakeFile::image('backdrop.jpg')->getContent() : (file_get_contents('https://picsum.photos/1920/1080') ?: ''),
                'backdrops'
            );
        });
    }

    private function saveImage(string $title, string $imageContent, string $directory): string
    {
        $filesystem = new Filesystem;
        $slugger = new AsciiSlugger;

        $path = "$directory/" . strtolower($slugger->slug($title)) . '.jpg';

        $filesystem->dumpFile($this->storage->absolutePath($path), $imageContent);

        return $path;
    }
}
