<?php

namespace App\Factory;

use App\Entity\Showing;
use Carbon\Carbon;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Showing>
 */
final class ShowingFactory extends PersistentProxyObjectFactory
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
        return Showing::class;
    }

    /**
     * @return array<string, mixed>
     */
    protected function defaults(): array
    {
        return [
            'movie' => MovieFactory::new(),
            'rows' => rand(4, 8),
            'columns' => rand(6, 10),
            'starts_at' => Carbon::now()->addDays(rand(0, 5))->setHour(rand(8, 22))->setMinutes([0, 15, 30, 45][rand(0, 3)])->setSeconds(0)->toDateTimeImmutable(),
        ];
    }
}
