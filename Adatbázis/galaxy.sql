-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2023. Máj 04. 19:37
-- Kiszolgáló verziója: 10.4.27-MariaDB
-- PHP verzió: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `galaxy`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `battlelog`
--

CREATE TABLE `battlelog` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `lastbattle` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `battlelog`
--

INSERT INTO `battlelog` (`id`, `uid`, `score`, `lastbattle`) VALUES
(1, 14, 3, '0001-01-01 00:00:00'),
(2, 16, 0, '2023-05-04 03:46:03');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `exploration`
--

CREATE TABLE `exploration` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `cooldownenddate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fleet`
--

CREATE TABLE `fleet` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `fleet`
--

INSERT INTO `fleet` (`id`, `pid`, `sid`, `count`) VALUES
(15, 28, 18, 12),
(16, 28, 19, 5),
(17, 29, 20, 3),
(22, 29, 21, 7);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `senderid` int(11) NOT NULL,
  `senderdeleted` tinyint(1) NOT NULL,
  `receiverid` int(11) NOT NULL,
  `receiverdeleted` tinyint(1) NOT NULL,
  `date` datetime NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `planet`
--

CREATE TABLE `planet` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `type` varchar(20) NOT NULL,
  `hqlvl` int(11) NOT NULL,
  `shipyardlvl` int(11) NOT NULL,
  `refinerylvl` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `planet`
--

INSERT INTO `planet` (`id`, `uid`, `name`, `type`, `hqlvl`, `shipyardlvl`, `refinerylvl`) VALUES
(28, 14, 'TopG', 'Lava', 3, 0, 0),
(29, 16, 'Planet', 'Gas', 1, 0, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `lastupdate` datetime NOT NULL,
  `steelcount` int(11) NOT NULL,
  `steellvl` int(11) NOT NULL,
  `uraniumcount` int(11) NOT NULL,
  `uraniumlvl` int(11) NOT NULL,
  `carboncount` int(11) NOT NULL,
  `carbonlvl` int(11) NOT NULL,
  `gascount` int(11) NOT NULL,
  `gaslvl` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `resources`
--

INSERT INTO `resources` (`id`, `pid`, `lastupdate`, `steelcount`, `steellvl`, `uraniumcount`, `uraniumlvl`, `carboncount`, `carbonlvl`, `gascount`, `gaslvl`) VALUES
(20, 28, '2023-04-10 18:18:52', 54620, 5, 58020, 3, 54483, 3, 55535, 3),
(21, 29, '2023-04-30 20:25:57', -15450, 0, -8450, 0, -9325, 0, -9584, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ship`
--

CREATE TABLE `ship` (
  `id` int(11) NOT NULL,
  `classid` int(11) NOT NULL,
  `weapontype` int(11) NOT NULL,
  `defensetype` int(11) NOT NULL,
  `propulsiontype` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `ship`
--

INSERT INTO `ship` (`id`, `classid`, `weapontype`, `defensetype`, `propulsiontype`) VALUES
(19, 1, 100, 200, 302),
(20, 1, 102, 202, 301),
(21, 2, 101, 200, 302),
(17, 2, 102, 200, 301),
(18, 5, 102, 200, 301);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `shipyardqueue`
--

CREATE TABLE `shipyardqueue` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `done` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pwHash` blob NOT NULL,
  `pwSalt` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `pwHash`, `pwSalt`) VALUES
(13, 'asd', 'asd@asd.com', 0x113dd0f18762a98ce3874dc0c327a5843ecab624fb3c0c772f8b4331d10c47626588d3e8bad9e3c6e5c00b9d15009a2dbf2cbf28f43f0ccefcee861c719af67c, 0xeae1c9910089f894249fea5817e0c2cdeb9430a71b2997ecb5f54a3d4b8cf5476f8e38a81712389afcc538d6196e6df13343edd939c1087c01fc446aa9647f45e0cd4dc7fa0f9d4c63c38d7363b8e4f6bc1c0875ab34993d35b9923268fb5fd91e3d930ef7ea71d50270142225ef95da3d01ce6e2aef71e3a5f246891f4fe565),
(14, 'AndrewAte', 'andrew@te.ro', 0x586d2d7ae323960dca25e6c089057019bcd980d19838bc2c8d977310e22202cec111cc9ea5c69b1ff9800d037795daff657bc21698dcdaa8127f9e9ce0a8cd20, 0x689df7e355a91ac220832d6425ddcdbc4475666f61a26e8ef71c3b51249e48680ae7f80280b7f23a10a1647a953a951e8d29c841dca458b0ce6705cc9a81a1267b6e29064b27b1beee5b35399be1ea002b867d47a245a40a1fd80981bc49a41bfe02572268d916ce2a5081a7fff7d09e99e3c756d88c94f15898ed70a13a5517),
(15, 'Target', 'message@tar.get', 0x8c23a5acb43c18d85e7d9fc55f1a513c7a569035a854c71111946a953227947814ad245ac845cb6fe72690ec94f2d0d5a3c33f4cf7f7a91dc0bd773c317d0343, 0x1b244ce53d8ab6a26da3ac7810275e74d128674a85434cb974411407cbf2185d05441f176ade14272ff4f2607f1a1a57201ba14c17279aee6183570d916d96d194f07f2ef04e0523a6fd88497ff599ed4291dd7a0d97ed17029803cb5a6516d3a59e19d924d19cef1fc3c87720c74d30e6a78dce6e60b8f1fee638f03f79b171),
(16, 'Test2', 'asd@asd2.cc', 0x20ac2cc7d0075234b241ac908ce90d7b8d68587e756bd428ee50d46524f036a1bc5fb666d6ad853a6ecc2c2e3219a1bdc2643987739a990ff457e86624ce9eb0, 0x82fc0734eb6d517c84d7491933e95e664d090ba8b3590145f3ea69b05149801f0ee192ca74977c13ed229d9c5b19cb2ec74fb08319763673294f52989cd9b692b19f11067fab43530330f0b8321c71604b4a155eaf443854b5ecc0e3e98b0bb40faee1cae559d8dfa213174e60cf7b360f94daf15f2a10f69c56b947da587690);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `battlelog`
--
ALTER TABLE `battlelog`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- A tábla indexei `exploration`
--
ALTER TABLE `exploration`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `fleet`
--
ALTER TABLE `fleet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pid` (`pid`),
  ADD KEY `sid` (`sid`);

--
-- A tábla indexei `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `planet`
--
ALTER TABLE `planet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- A tábla indexei `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_planet_res` (`pid`);

--
-- A tábla indexei `ship`
--
ALTER TABLE `ship`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `U_Ship` (`classid`,`weapontype`,`defensetype`,`propulsiontype`);

--
-- A tábla indexei `shipyardqueue`
--
ALTER TABLE `shipyardqueue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sid` (`sid`),
  ADD KEY `fk_planet_syq` (`pid`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `battlelog`
--
ALTER TABLE `battlelog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `exploration`
--
ALTER TABLE `exploration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `fleet`
--
ALTER TABLE `fleet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `planet`
--
ALTER TABLE `planet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT a táblához `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `ship`
--
ALTER TABLE `ship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `shipyardqueue`
--
ALTER TABLE `shipyardqueue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `fleet`
--
ALTER TABLE `fleet`
  ADD CONSTRAINT `fk_planet_fle` FOREIGN KEY (`pid`) REFERENCES `planet` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Megkötések a táblához `planet`
--
ALTER TABLE `planet`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Megkötések a táblához `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `fk_planet_res` FOREIGN KEY (`pid`) REFERENCES `planet` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Megkötések a táblához `shipyardqueue`
--
ALTER TABLE `shipyardqueue`
  ADD CONSTRAINT `fk_planet_syq` FOREIGN KEY (`pid`) REFERENCES `planet` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
