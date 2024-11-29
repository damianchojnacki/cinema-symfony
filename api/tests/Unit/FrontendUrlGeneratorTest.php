<?php

namespace App\Tests\Unit;

use App\Entity\Reservation;
use App\Service\FrontendUrlGenerator;
use PHPUnit\Framework\TestCase;

class FrontendUrlGeneratorTest extends TestCase
{
    private FrontendUrlGenerator $urlGenerator;

    protected function setUp(): void
    {
        $this->urlGenerator = new FrontendUrlGenerator('https://example.com');
    }

    public function test_base_returns_base_url(): void
    {
        $this->assertSame('https://example.com', $this->urlGenerator->base());
    }

    public function test_homepage_returns_base_url(): void
    {
        $this->assertSame('https://example.com', $this->urlGenerator->homepage());
    }

    public function test_path_generates_url_without_parameters(): void
    {
        $path = 'about';
        $expectedUrl = 'https://example.com/about';

        $this->assertSame($expectedUrl, $this->urlGenerator->path($path));
    }

    public function test_path_generates_url_with_parameters(): void
    {
        $path = 'search';
        $parameters = ['q' => 'query', 'page' => 2];
        $expectedUrl = 'https://example.com/search?q=query&page=2';

        $this->assertSame($expectedUrl, $this->urlGenerator->path($path, $parameters));
    }

    public function test_reservation_generates_url_for_reservation(): void
    {
        $reservation = $this->createMock(Reservation::class);
        $reservation->token = 'abcd1234';

        $expectedUrl = 'https://example.com/reservations/abcd1234';

        $this->assertSame($expectedUrl, $this->urlGenerator->reservation($reservation));
    }
}
