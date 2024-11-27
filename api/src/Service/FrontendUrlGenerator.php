<?php

namespace App\Service;

use App\Entity\Reservation;

class FrontendUrlGenerator
{
    public function __construct(protected string $baseUrl) {}

    public function base(): string
    {
        return $this->baseUrl;
    }

    public function homepage(): string
    {
        return $this->base();
    }

    /**
     * @param  array<string, mixed>  $parameters
     */
    public function path(string $path, array $parameters = []): string
    {
        return $this->base() . '/' . $path . ($parameters ? '?' . http_build_query($parameters) : '');
    }

    public function reservation(Reservation $reservation): string
    {
        return $this->path("reservations/$reservation->token");
    }
}
