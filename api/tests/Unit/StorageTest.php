<?php

namespace App\Tests\Unit;

use App\Kernel;
use App\Service\Storage;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Filesystem\Filesystem;

class StorageTest extends KernelTestCase
{
    public function test_root_method_returns_correct_storage_folder(): void
    {
        $container = static::getContainer();

        $mockKernel = $this->createMock(Kernel::class);
        $mockKernel->method('getProjectDir')->willReturn('/tmp');

        $container->set(Kernel::class, $mockKernel);

        $storage = $container->get(Storage::class);

        $this->assertSame('/tmp/storage/', $storage->root());
    }

    public function test_fake_method_changes_storage_dir_and_removes_old_directory(): void
    {
        $container = static::getContainer();

        $mockKernel = $this->createMock(Kernel::class);
        $mockKernel->method('getProjectDir')
            ->willReturn('/tmp');

        $container->set(Kernel::class, $mockKernel);

        $filesystem = new Filesystem;
        $filesystem->mkdir('/tmp/storage/fake');
        $filesystem->touch($file = '/tmp/storage/fake/test');

        $storage = $container->get(Storage::class);

        $storage->fake();

        $this->assertSame('/tmp/storage/fake/', $storage->root());

        $this->assertFalse($filesystem->exists($file));
    }

    public function test_absolute_path_combines_root_and_path(): void
    {
        $mockKernel = $this->createMock(Kernel::class);
        $mockKernel->method('getProjectDir')->willReturn('/tmp');

        $storage = new Storage($mockKernel);

        $this->assertSame('/tmp/storage/file.txt', $storage->absolutePath('file.txt'));
    }

    public function test_path_appends_to_storage_dir(): void
    {
        $mockKernel = $this->createMock(Kernel::class);

        $storage = new Storage($mockKernel);

        $this->assertSame('storage/file.txt', $storage->path('file.txt'));
    }
}
