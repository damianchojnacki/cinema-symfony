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

    public function testBaseReturnsBaseUrl(): void
    {
        $this->assertSame('https://example.com', $this->urlGenerator->base());
    }

    public function testHomepageReturnsBaseUrl(): void
    {
        $this->assertSame('https://example.com', $this->urlGenerator->homepage());
    }

    public function testPathGeneratesUrlWithoutParameters(): void
    {
        $path = 'about';
        $expectedUrl = 'https://example.com/about';

        $this->assertSame($expectedUrl, $this->urlGenerator->path($path));
    }

    public function testPathGeneratesUrlWithParameters(): void
    {
        $path = 'search';
        $parameters = ['q' => 'query', 'page' => 2];
        $expectedUrl = 'https://example.com/search?q=query&page=2';

        $this->assertSame($expectedUrl, $this->urlGenerator->path($path, $parameters));
    }

    public function testReservationGeneratesUrlForReservation(): void
    {
        $reservation = $this->createMock(Reservation::class);
        $reservation->token = 'abcd1234';

        $expectedUrl = 'https://example.com/reservations/abcd1234';

        $this->assertSame($expectedUrl, $this->urlGenerator->reservation($reservation));
    }
}
