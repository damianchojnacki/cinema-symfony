<?php

namespace App\Utils;

use App\Kernel;
use Symfony\Component\Filesystem\Filesystem;

class Storage
{
    protected static string $storageDir = 'storage/';

    public function __construct(protected Kernel $kernel) {}

    public function fake(): self
    {
        self::$storageDir = 'storage/fake/';

        $filesystem = new Filesystem;

        $filesystem->remove($this->path());

        return $this;
    }

    public function path(): string
    {
        return $this->kernel->getProjectDir() . '/' . self::$storageDir;
    }
}
