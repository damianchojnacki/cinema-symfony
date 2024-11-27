<?php

namespace App\Controller;

use App\Utils\Storage;
use League\Glide\Filesystem\FileNotFoundException;
use League\Glide\Responses\SymfonyResponseFactory;
use League\Glide\ServerFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

class ImageController extends AbstractController
{
    #[Route('/storage/{path}', name: 'image_show', requirements: ['path' => ".*\..+"], methods: ['GET'])]
    public function index(string $path, Request $request, Storage $storage): Response
    {
        $server = ServerFactory::create([
            'response' => new SymfonyResponseFactory,
            'source' => $storage->path(),
            'cache' => $storage->path() . '/cache',
        ]);

        try {
            return $server->getImageResponse($path, $request->query->all());
        } catch (FileNotFoundException $e) {
            throw new NotFoundHttpException('Image not found.');
        }
    }
}
