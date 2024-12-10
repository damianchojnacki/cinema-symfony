<?php

namespace App\Service;

use App\Kernel;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class Storage
{
    protected string $storageDir = 'storage/';

    public function __construct(protected Kernel $kernel) {}

    public function fake(): self
    {
        $this->storageDir = 'storage/fake/';

        $this->filesystem()->mkdir($this->root());

        $this->purge();

        return $this;
    }

    public function absolutePath(string $path): string
    {
        return $this->root() . $path;
    }

    public function path(string $path): string
    {
        return $this->storageDir . $path;
    }

    public function root(): string
    {
        return $this->kernel->getProjectDir() . '/' . $this->storageDir;
    }

    public function purge(): void
    {
        $finder = new Finder();

        $finder->depth(0)->in($this->root());

        foreach ($finder as $file) {
             $this->filesystem()->remove($file->getRealPath());
        }
    }

    public function filesystem(): Filesystem
    {
        return new Filesystem;
    }
}
