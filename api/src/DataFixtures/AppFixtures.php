<?php

namespace App\DataFixtures;

use App\Story\MoviesStory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        MoviesStory::load();
    }
}
