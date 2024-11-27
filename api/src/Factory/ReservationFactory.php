<?php

namespace App\Factory;

use App\Entity\Reservation;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Reservation>
 */
final class ReservationFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    public static function class(): string
    {
        return Reservation::class;
    }

    /**
     * @return array<string, mixed>
     */
    protected function defaults(): array
    {
        return [
            'email' => self::faker()->email(),
            'showing' => ShowingFactory::new(),
        ];
    }

    protected function initialize(): static
    {
        return $this->afterInstantiate(function (Reservation $reservation) {
            foreach (range(0, rand(1, 4)) as $i) {
                $reservation->seats[] = [rand(0, $reservation->showing->rows), rand(0, $reservation->showing->columns)];
            }

            $reservation->total = number_format(count($reservation->seats) * 9, 2);
        });
    }
}
