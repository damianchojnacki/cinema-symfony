<?php

namespace App\Service;

use RuntimeException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FakeFile
{
    public static function image(string $name, int $width = 10, int $height = 10): UploadedFile
    {
        $tempFilename = static::generateImage($width, $height);

        return new UploadedFile(
            $tempFilename,
            $name,
            'image/jpeg',
            null,
            true
        );
    }

    protected static function generateImage(int $width, int $height): string
    {
        $tempFilename = tempnam(sys_get_temp_dir(), 'fake_image');

        if (! $tempFilename) {
            throw new RuntimeException('Failed to create temp file');
        }

        $image = imagecreatetruecolor(max(1, $width), max(1, $height));

        ob_start();

        imagejpeg($image);
        imagedestroy($image);

        ob_end_clean();

        return $tempFilename;
    }
}
