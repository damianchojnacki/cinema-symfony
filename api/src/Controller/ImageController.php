<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Service\FrontendUrlGenerator;
use App\Service\Storage;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
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
            'source' => $storage->root(),
            'cache' => $storage->path('cache'),
        ]);

        try {
            return $server->getImageResponse($path, $request->query->all());
        } catch (FileNotFoundException $e) {
            throw new NotFoundHttpException('Image not found.');
        }
    }

    #[Route('/reservations/{token}/qr', name: 'reservations_qr_show', methods: ['GET'])]
    public function qr(Reservation $reservation, FrontendUrlGenerator $urlGenerator): Response
    {
        $url = $urlGenerator->reservation($reservation);

        $options = new QROptions([
            'outputBase64' => false,
            'quietzoneSize' => 2,
        ]);

        $qrcode = (new QRCode($options))->render($url);

        return new Response($qrcode, 200, ['Content-Type' => 'image/svg+xml']);
    }
}
