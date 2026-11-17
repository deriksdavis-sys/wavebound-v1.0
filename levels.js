(() => {
  "use strict";

  const T = 30;

  const levels = [
    {
      name: "SHALLOW SHORE",
      theme: "shore",
      cols: 216,
      spawn: { x: 126, y: 348 },
      goalX: 6360,
      goalY: 13,
      saveX: [1100, 2760, 4350, 5730],
      saves: [{ x: 1100, r: 13 }, { x: 2760, r: 13 }, { x: 4350, r: 13 }, { x: 5730, r: 13 }],
      build(g) {
g.ground(13, 0, 17);
        g.ground(11, 18, 22);
        g.ground(13, 23, 34);
        g.ground(31, 35, 35);
        g.ground(16, 36, 36, 24);
        g.ground(30, 36, 36);
        g.ground(16, 37, 37, 24);
        g.ground(29, 37, 37);
        g.ground(16, 38, 41, 24);
        g.ground(28, 38, 41);
        g.ground(16, 42, 43, 23);
        g.ground(27, 42, 43);
        g.ground(16, 44, 47, 23);
        g.ground(26, 44, 47);
        g.ground(13, 48, 48, 17);
        g.ground(21, 48, 48, 23);
        g.ground(26, 48, 48);
        g.ground(13, 49, 49, 17);
        g.ground(21, 49, 49, 22);
        g.ground(26, 49, 49);
        g.ground(13, 50, 50, 17);
        g.ground(21, 50, 50, 21);
        g.ground(26, 50, 50);
        g.ground(13, 51, 51, 17);
        g.ground(20, 51, 51, 21);
        g.ground(25, 51, 51);
        g.ground(13, 52, 52, 17);
        g.ground(20, 52, 52, 20);
        g.ground(25, 52, 52);
        g.ground(11, 53, 53, 17);
        g.ground(25, 53, 53);
        g.ground(11, 54, 55, 18);
        g.ground(21, 54, 55, 21);
        g.ground(25, 54, 55);
        g.ground(11, 56, 56, 18);
        g.ground(24, 56, 56);
        g.ground(11, 57, 57, 18);
        g.ground(22, 57, 57, 22);
        g.ground(24, 57, 57);
        g.ground(11, 58, 59, 18);
        g.ground(24, 58, 59);
        g.ground(9, 60, 63, 18);
        g.ground(24, 60, 63);
        g.ground(9, 64, 64, 19);
        g.ground(23, 64, 64);
        g.ground(9, 65, 65, 18);
        g.ground(23, 65, 65);
        g.ground(9, 66, 66, 17);
        g.ground(23, 66, 66);
        g.ground(11, 67, 68, 18);
        g.ground(22, 67, 68);
        g.ground(11, 69, 69, 17);
        g.ground(21, 69, 69);
        g.ground(11, 70, 70, 16);
        g.ground(21, 70, 70);
        g.ground(11, 71, 71, 15);
        g.ground(21, 71, 71);
        g.ground(11, 72, 72, 15);
        g.ground(20, 72, 72);
        g.ground(13, 73, 73, 15);
        g.ground(19, 73, 73);
        g.ground(13, 74, 74, 14);
        g.ground(20, 74, 74);
        g.ground(13, 75, 77, 14);
        g.ground(19, 75, 77);
        g.ground(13, 78, 78, 13);
        g.ground(18, 78, 78);
        g.ground(18, 79, 79);
        g.ground(8, 80, 80, 8);
        g.ground(15, 80, 80, 15);
        g.ground(17, 80, 80);
        g.ground(15, 81, 81, 15);
        g.ground(17, 81, 81);
        g.ground(6, 82, 82, 6);
        g.ground(15, 82, 82, 15);
        g.ground(17, 82, 82);
        g.ground(7, 83, 83, 7);
        g.ground(14, 83, 83, 15);
        g.ground(17, 83, 83);
        g.ground(14, 84, 84, 15);
        g.ground(17, 84, 84);
        g.ground(10, 85, 85, 10);
        g.ground(14, 85, 85, 15);
        g.ground(17, 85, 85);
        g.ground(14, 86, 89, 15);
        g.ground(17, 86, 89);
        g.ground(17, 90, 90);
        g.ground(13, 91, 93, 14);
        g.ground(17, 91, 93);
        g.ground(13, 94, 96);
        g.ground(12, 97, 99);
        g.ground(11, 100, 103);
        g.ground(13, 104, 108);
        g.ground(13, 110, 118);
        g.ground(12, 119, 119);
        g.ground(10, 120, 127);
        g.ground(13, 128, 151);
        g.ground(16, 152, 161);
        g.ground(13, 162, 172);
        g.ground(11, 173, 175);
        g.ground(10, 176, 189);
        g.ground(11, 190, 215);
        g.door(109, 2, 24, "red");
        g.door(119, 5, 11, "blue");
        g.platform(5, 71, 72);
        g.platform(5, 75, 76);
        g.platform(5, 84, 84);
        g.platform(5, 86, 86);
        g.platform(5, 89, 89);
        g.platform(6, 67, 68);
        g.platform(6, 93, 93);
        g.platform(7, 63, 64);
        g.platform(7, 97, 97);
        g.water(36, 47, 14);
        g.water(152, 161, 14);
        g.wind(91, 91, 12, 12, 1500);
        g.wind(91, 91, 10, 11, 1500);
        g.wind(91, 91, 5, 9, 1500);
      },
      picks: [["ticket", 6, 12], ["ticket", 11, 12], ["ticket", 16, 12], ["ticket", 22, 10], ["ticket", 28, 12], ["conch", 20, 10], ["ticket", 37, 15], ["ticket", 39, 15], ["ticket", 41, 15], ["ticket", 44, 15], ["bubble", 38, 14], ["bubble", 43, 14], ["ticket", 63, 6], ["ticket", 67, 5], ["ticket", 71, 4], ["ticket", 75, 4], ["feather", 69, 3], ["ticket", 80, 12], ["ticket", 93, 12], ["ticket", 102, 10], ["ticket", 104, 12], ["key_red", 37, 27], ["ticket", 138, 12], ["ticket", 122, 9], ["ticket", 125, 9], ["ticket", 127, 9], ["starprize", 123, 9], ["key_blue", 61, 7], ["ticket", 153, 15], ["ticket", 155, 15], ["ticket", 158, 15], ["ticket", 160, 15], ["bubble", 154, 14], ["bubble", 159, 14], ["ticket", 164, 12], ["ticket", 168, 12], ["ticket", 177, 9], ["ticket", 181, 9], ["feather", 180, 9], ["ticket", 194, 10], ["ticket", 201, 10], ["ticket", 208, 10], ["feather", 49, 19], ["conch", 64, 22]],
      baddies: [["crab", 24, 12], ["crab", 54, 10], ["star", 64, 2], ["crab", 80, 12], ["crab", 88, 12], ["crab", 113, 12], ["crab", 129, 12], ["crab", 163, 12], ["crab", 192, 10], ["star", 182, 2], ["crab", 200, 10], ["crabj", 40, 12], ["crabj", 100, 8], ["crabj", 150, 12], ["crabj", 215, 8], ["crab", 92, 15], ["crab", 83, 16], ["crabj", 40, 28], ["crabj", 48, 25], ["crabj", 61, 23], ["crabj", 75, 18], ["crabj", 68, 21]],
      npcs: [],
    },

    {
      name: "TWINTAIL TOWN",
      theme: "town",
      cols: 204,
      spawn: { x: 126, y: 348 },
      goalX: 6000,
      goalY: 13,
      saveX: [1110, 2700, 4200, 5430],
      saves: [{ x: 1110, r: 13 }, { x: 2700, r: 13 }, { x: 4200, r: 13 }, { x: 5430, r: 13 }],
      build(g) {
        g.ground(13, 0, 5);
        g.ground(9, 6, 12);
        g.ground(13, 13, 32);
        g.ground(9, 33, 38);
        g.ground(13, 39, 40);
        g.ground(11, 41, 44);
        g.ground(13, 45, 45);
        g.ground(9, 46, 52);
        g.ground(11, 54, 57);
        g.ground(35, 58, 59);
        g.ground(13, 60, 60, 30);
        g.ground(34, 60, 60);
        g.ground(13, 61, 61, 31);
        g.ground(34, 61, 61);
        g.ground(17, 62, 62, 31);
        g.ground(34, 62, 62);
        g.ground(19, 63, 63, 31);
        g.ground(34, 63, 63);
        g.ground(20, 64, 64, 31);
        g.ground(34, 64, 64);
        g.ground(13, 65, 65, 14);
        g.ground(21, 65, 65, 31);
        g.ground(34, 65, 65);
        g.ground(9, 66, 66, 9);
        g.ground(13, 66, 66, 16);
        g.ground(22, 66, 66, 31);
        g.ground(34, 66, 66);
        g.ground(9, 67, 67, 17);
        g.ground(23, 67, 67, 30);
        g.ground(34, 67, 67);
        g.ground(9, 68, 68, 18);
        g.ground(25, 68, 68, 29);
        g.ground(34, 68, 68);
        g.ground(9, 69, 69, 20);
        g.ground(26, 69, 69, 29);
        g.ground(34, 69, 69);
        g.ground(9, 70, 70, 21);
        g.ground(26, 70, 70, 28);
        g.ground(34, 70, 70);
        g.ground(9, 71, 71, 9);
        g.ground(13, 71, 71, 22);
        g.ground(27, 71, 71, 27);
        g.ground(35, 71, 71);
        g.ground(13, 72, 72, 22);
        g.ground(35, 72, 72);
        g.ground(13, 73, 73, 22);
        g.ground(34, 73, 73);
        g.ground(13, 74, 74, 23);
        g.ground(31, 74, 74);
        g.ground(13, 75, 75, 23);
        g.ground(30, 75, 75);
        g.ground(13, 76, 76, 23);
        g.ground(29, 76, 76);
        g.ground(13, 77, 84, 23);
        g.ground(28, 77, 84);
        g.ground(13, 85, 91, 24);
        g.ground(28, 85, 91);
        g.ground(17, 92, 102, 24);
        g.ground(28, 92, 102);
        g.ground(13, 103, 107, 24);
        g.ground(28, 103, 107);
        g.ground(11, 108, 108, 24);
        g.ground(28, 108, 108);
        g.ground(11, 109, 109, 24);
        g.ground(29, 109, 109);
        g.ground(11, 110, 110, 24);
        g.ground(28, 110, 110);
        g.ground(11, 111, 111, 24);
        g.ground(29, 111, 111);
        g.ground(11, 112, 113, 24);
        g.ground(28, 112, 113);
        g.ground(9, 114, 116, 24);
        g.ground(28, 114, 116);
        g.ground(9, 117, 117, 24);
        g.ground(29, 117, 117);
        g.ground(9, 118, 119, 24);
        g.ground(28, 118, 119);
        g.ground(13, 120, 120, 24);
        g.ground(28, 120, 120);
        g.ground(11, 121, 122, 24);
        g.ground(28, 121, 122);
        g.ground(11, 123, 123, 24);
        g.ground(29, 123, 123);
        g.ground(8, 124, 125, 24);
        g.ground(28, 124, 125);
        g.ground(8, 126, 128, 24);
        g.ground(29, 126, 128);
        g.ground(8, 129, 131, 23);
        g.ground(29, 129, 131);
        g.ground(10, 132, 132, 23);
        g.ground(29, 132, 132);
        g.ground(13, 133, 133, 24);
        g.ground(30, 133, 133);
        g.ground(30, 134, 134);
        g.ground(13, 135, 135, 23);
        g.ground(25, 135, 135, 25);
        g.ground(28, 135, 135);
        g.ground(13, 136, 136, 23);
        g.ground(25, 136, 136, 26);
        g.ground(28, 136, 136);
        g.ground(13, 137, 137, 27);
        g.ground(29, 137, 137);
        g.ground(13, 138, 140, 23);
        g.ground(25, 138, 140);
        g.ground(13, 141, 141);
        g.ground(13, 142, 142, 23);
        g.ground(25, 142, 142, 27);
        g.ground(29, 142, 142);
        g.ground(13, 143, 144, 24);
        g.ground(26, 143, 144);
        g.ground(13, 145, 145, 25);
        g.ground(27, 145, 145);
        g.ground(13, 146, 146, 27);
        g.ground(29, 146, 146);
        g.ground(13, 147, 147, 27);
        g.ground(30, 147, 147);
        g.ground(13, 148, 169);
        g.ground(10, 170, 170, 10);
        g.ground(13, 170, 170);
        g.ground(10, 171, 179);
        g.ground(10, 180, 180, 10);
        g.ground(13, 180, 180);
        g.ground(13, 181, 203);
        g.cliff(66, 10, 12);
        g.cliff(71, 10, 12);
        g.cliff(170, 11, 12);
        g.cliff(180, 11, 12);
        g.door(59, 2, 24, "green");
        g.door(134, 2, 24, "yellow");
        g.platform(7, 117, 118);
        g.platform(12, 93, 95);
        g.platform(12, 99, 101);
        g.platform(27, 74, 74);
        g.platform(29, 72, 72);
        g.platform(32, 72, 72);
        g.platform(33, 71, 71);
        g.platform(33, 73, 73);
        g.cloud(2, 182, 184);
        g.cloud(4, 188, 190);
        g.cloud(5, 74, 77);
        g.cloud(8, 68, 70);
        g.water(92, 102, 14);
        g.wind(72, 73, 2, 8, 1500);
        g.wind(179, 180, 3, 8, 1500);
        g.wind(63, 64, 3, 18, 1500);
      },
      picks: [["ticket", 5, 12], ["ticket", 14, 12], ["ticket", 20, 12], ["ticket", 26, 12], ["ticket", 10, 8], ["ticket", 18, 8], ["ticket", 35, 8], ["ticket", 49, 8], ["key_green", 39, 11], ["ticket", 63, 12], ["ticket", 68, 8], ["feather", 102, 27], ["ticket", 73, 12], ["ticket", 74, 4], ["ticket", 76, 4], ["ticket", 78, 11], ["conch", 83, 11], ["ticket", 82, 11], ["starprize", 81, 11], ["ticket", 93, 15], ["ticket", 95, 14], ["ticket", 97, 15], ["ticket", 100, 14], ["bubble", 94, 14], ["bubble", 98, 14], ["ticket", 110, 10], ["ticket", 116, 8], ["ticket", 128, 7], ["key_yellow", 102, 15], ["ticket", 138, 12], ["ticket", 144, 12], ["ticket", 152, 12], ["ticket", 173, 9], ["ticket", 178, 9], ["feather", 176, 8], ["ticket", 188, 11], ["ticket", 196, 11], ["ticket", 183, 1], ["ticket", 189, 3], ["stone_white", 170, 8], ["stone_black", 59, 32]],
      baddies: [["crab", 25, 12], ["crab", 45, 12], ["star", 68, 2], ["crab", 88, 12], ["crab", 106, 12], ["crab", 136, 12], ["crab", 140, 12], ["star", 172, 2], ["crab", 190, 12], ["crabj", 20, 12], ["crabj", 150, 12], ["crabj", 195, 12], ["crabj", 85, 28], ["crabj", 91, 27], ["crabj", 64, 33], ["crabj", 128, 28], ["crabj", 119, 27]],
      npcs: [{ t: "sign", c: 3, r: 13, name: "Signpost", lines: ["Welcome to TWINTAIL TOWN!"], face: -1 }, { t: "elder", c: 9, r: 9, name: "Old Merell", lines: ["Every otter in Twintail Town is born with the green tide in its blood.", "The AMPHITRITE SNOWDANS ring the deep, and the otters ride them high.", "Colored gates need a matching key."], face: -1 }, { t: "vendor", c: 35, r: 9, name: "Octo the Shopkeep", lines: ["Welcome, little crownless one. I trade in Otter Tickets!"], face: -1, trade: true }, { t: "kid", c: 22, r: 13, name: "Pip", lines: ["I'm the fastest otter in town! Made it up to the roof.", "Hold JUMP to glide with a wind-feather.", "If you ever find a WHITE and a BLACK otter stone, bring 'em back to me!"], face: -1, quest: "stones" }],
    },

    {
      name: "SUNKEN TUNNEL",
      theme: "cave",
      underwater: true,
      cols: 210,
      spawn: { x: 180, y: 324 },
      goalX: 6180,
      goalY: 3,
      saveX: [900, 2700, 4320, 5760],
      saveY: 12,
      build(g) {
g.ground(12, 0, 22);
        g.ground(10, 23, 27);
        g.ground(12, 28, 29);
        g.ground(2, 30, 34, 5);
        g.ground(12, 30, 34);
        g.ground(12, 35, 50);
        g.ground(16, 51, 62);
        g.ground(12, 63, 69);
        g.ground(2, 70, 73, 5);
        g.ground(12, 70, 73);
        g.ground(12, 74, 84);
        g.ground(18, 85, 96);
        g.ground(12, 97, 97);
        g.ground(11, 98, 103);
        g.ground(27, 104, 104);
        g.ground(12, 105, 119);
        g.ground(23, 120, 120);
        g.ground(8, 121, 124);
        g.ground(2, 125, 129, 6);
        g.ground(8, 125, 129);
        g.ground(8, 130, 133);
        g.ground(14, 134, 136);
        g.ground(2, 137, 141, 5);
        g.ground(14, 137, 141);
        g.ground(14, 142, 150);
        g.ground(10, 151, 166);
        g.ground(14, 167, 190);
        g.ground(11, 191, 209);
        g.door(104, 2, 26, "orange");
        g.door(120, 6, 22, "indigo");
        g.platform(8, 66, 69);
        g.platform(9, 112, 115);
        g.water(0, 209, 0);
        g.current(51, 62, 14, 16, 140, 0);
        g.current(85, 96, 16, 20, 0, 120);
      },
      picks: [["ticket", 5, 10], ["ticket", 10, 10], ["ticket", 16, 10], ["ticket", 25, 8], ["ticket", 32, 10], ["ticket", 54, 14], ["ticket", 57, 14], ["ticket", 60, 12], ["bubble", 52, 13], ["bubble", 58, 13], ["ticket", 68, 10], ["ticket", 72, 11], ["bubble", 74, 10], ["ticket", 87, 15], ["ticket", 89, 13], ["ticket", 92, 16], ["ticket", 95, 14], ["bubble", 88, 11], ["bubble", 94, 13], ["ticket", 99, 10], ["ticket", 100, 10], ["ticket", 102, 10], ["key_orange", 61, 14], ["ticket", 123, 7], ["ticket", 126, 7], ["conch", 128, 7], ["ticket", 129, 7], ["ticket", 131, 7], ["starprize", 112, 8], ["ticket", 135, 12], ["ticket", 141, 12], ["bubble", 113, 8], ["key_indigo", 95, 16], ["ticket", 155, 8], ["ticket", 160, 8], ["ticket", 164, 8], ["ticket", 170, 13], ["ticket", 176, 13], ["ticket", 183, 12], ["ticket", 188, 13], ["ticket", 193, 9], ["ticket", 198, 9], ["starprize", 201, 9], ["ticket", 204, 9]],
      baddies: [["jelly", 20, 9], ["jelly", 45, 8], ["eel", 58, 14], ["eel", 74, 11], ["jelly", 90, 16], ["jelly", 105, 9], ["eel", 114, 9], ["jelly", 135, 11], ["eel", 138, 11], ["jelly", 158, 8], ["eel", 180, 13], ["jelly", 200, 9], ["crabj", 35, 11], ["crabj", 120, 4], ["crabj", 176, 9]],
      npcs: [],
      chests: [{ c: 170, r: 12, reward: { tix: 50 } }],
    },

    {
      name: "CRAB KING FALLS",
      theme: "falls",
      cols: 224,
      spawn: { x: 126, y: 264 },
      goalX: 6420,
      goalY: 13,
      saveX: [1200, 2700, 4230, 5700],
      saveY: 13,
      gates: [{ c: 152, r0: 0 }],
      boss: { kind: "crabk", hp: 5, x: 5280, y: 276, name: "CRAB KING KOA", reward: "jump" },
      build(g) {
g.ground(10, 0, 30);
        g.ground(13, 31, 35);
        g.ground(11, 36, 40);
        g.ground(13, 41, 52);
        g.ground(24, 53, 60);
        g.ground(13, 61, 72);
        g.ground(9, 73, 77);
        g.ground(7, 78, 83);
        g.ground(13, 84, 90);
        g.ground(11, 91, 91);
        g.ground(9, 92, 95);
        g.ground(13, 97, 102);
        g.ground(11, 103, 108);
        g.ground(13, 109, 132);
        g.ground(11, 133, 133);
        g.ground(9, 134, 141);
        g.ground(13, 142, 145);
        g.ground(11, 146, 149);
        g.ground(13, 150, 151);
        g.ground(10, 153, 212);
        g.ground(13, 213, 223);
        g.door(96, 2, 24, "violet");
        g.water(53, 60, 13);
        g.current(53, 60, 14, 22, 0, 130);
      },
      picks: [["ticket", 8, 9], ["ticket", 14, 9], ["ticket", 20, 9], ["ticket", 26, 9], ["ticket", 35, 12], ["ticket", 41, 12], ["ticket", 55, 18], ["ticket", 57, 16], ["ticket", 59, 20], ["ticket", 56, 22], ["bubble", 54, 15], ["bubble", 58, 19], ["ticket", 65, 12], ["ticket", 75, 8], ["feather", 80, 6], ["ticket", 82, 6], ["ticket", 88, 12], ["ticket", 93, 8], ["key_violet", 59, 17], ["ticket", 101, 12], ["ticket", 105, 10], ["ticket", 111, 12], ["ticket", 118, 12], ["ticket", 136, 8], ["ticket", 138, 8], ["ticket", 139, 8], ["starprize", 137, 8], ["ticket", 143, 12], ["ticket", 156, 9], ["ticket", 163, 9], ["conch", 170, 9], ["ticket", 178, 9], ["feather", 183, 8], ["ticket", 185, 9], ["ticket", 190, 9], ["ticket", 198, 9], ["ticket", 216, 12], ["ticket", 220, 12]],
      baddies: [["crab", 12, 9], ["crab", 18, 9], ["crab", 32, 12], ["star", 48, 2], ["star", 60, 2], ["crab", 70, 12], ["star", 80, 2], ["crab", 86, 12], ["crab", 99, 12], ["crab", 110, 12], ["crab", 118, 12], ["crab", 124, 12], ["crab", 143, 12], ["crab", 160, 9], ["crab", 166, 9], ["star", 175, 2], ["crabj", 40, 8], ["crabj", 130, 12], ["crabj", 190, 8], ["crab", 196, 9], ["crab", 205, 9]],
      npcs: [{ t: "sign", c: 33, r: 12, name: "Signpost", lines: ["The falls drain the high sea to the sunken WORLD.", "Beasts up ahead guard an Otter Ticket key to the Leap."], face: -1 }],
    },

    {
      name: "ABYSSAL SERPENT",
      theme: "abyss",
      underwater: true,
      cols: 213,
      spawn: { x: 180, y: 440 },
      goalX: 6240,
      goalY: 3,
      saveX: [900, 2550, 4200, 5700],
      saveY: 12,
      gates: [{ c: 172, r0: 0 }],
      boss: { kind: "serpent", hp: 6, x: 5880, y: 350, name: "ABYSSAL SERPENT VASUKI", reward: "bolt" },
      build(g) {
g.ground(16, 0, 18);
        g.ground(12, 19, 34);
        g.ground(14, 35, 39);
        g.ground(2, 40, 44, 6);
        g.ground(14, 40, 44);
        g.ground(14, 45, 54);
        g.ground(17, 55, 72);
        g.ground(12, 73, 77);
        g.ground(10, 78, 84);
        g.ground(12, 85, 90);
        g.ground(27, 91, 91);
        g.ground(12, 92, 111);
        g.ground(21, 112, 112);
        g.ground(7, 113, 115);
        g.ground(2, 116, 120, 5);
        g.ground(7, 116, 120);
        g.ground(7, 121, 124);
        g.ground(15, 125, 129);
        g.ground(2, 130, 133, 5);
        g.ground(15, 130, 133);
        g.ground(15, 134, 144);
        g.ground(10, 145, 166);
        g.ground(12, 167, 170);
        g.ground(2, 173, 174, 4);
        g.ground(24, 175, 212);
        g.door(91, 2, 26, "indigo");
        g.door(112, 5, 20, "green");
        g.platform(7, 150, 152);
        g.platform(8, 22, 24);
        g.platform(9, 100, 103);
        g.water(0, 212, 0);
        g.current(38, 52, 13, 16, 160, 0);
        g.current(55, 72, 15, 18, 90, 0);
      },
      picks: [["ticket", 4, 14], ["ticket", 10, 13], ["ticket", 16, 14], ["ticket", 22, 6], ["ticket", 33, 10], ["ticket", 40, 13], ["ticket", 44, 11], ["bubble", 41, 12], ["bubble", 48, 13], ["ticket", 58, 16], ["ticket", 63, 16], ["ticket", 68, 16], ["bubble", 60, 16], ["ticket", 77, 10], ["ticket", 82, 9], ["ticket", 85, 10], ["key_indigo", 26, 9], ["ticket", 98, 10], ["ticket", 104, 10], ["ticket", 110, 11], ["bubble", 107, 9], ["key_green", 65, 15], ["ticket", 115, 6], ["ticket", 118, 6], ["conch", 119, 6], ["ticket", 121, 6], ["ticket", 123, 6], ["starprize", 120, 6], ["ticket", 128, 13], ["ticket", 137, 13], ["ticket", 141, 12], ["ticket", 148, 8], ["ticket", 154, 8], ["ticket", 160, 8], ["ticket", 168, 11], ["ticket", 180, 20], ["ticket", 186, 14], ["ticket", 192, 8], ["ticket", 200, 20], ["ticket", 204, 12], ["bubble", 183, 18], ["bubble", 196, 10], ["starprize", 206, 18]],
      baddies: [["jelly", 8, 13], ["eel", 14, 13], ["eel", 30, 10], ["jelly", 42, 13], ["eel", 60, 16], ["jelly", 75, 11], ["eel", 83, 9], ["jelly", 99, 9], ["eel", 108, 10], ["jelly", 118, 6], ["eel", 131, 12], ["jelly", 150, 7], ["eel", 158, 9], ["jelly", 170, 10], ["eel", 185, 18], ["jelly", 195, 12], ["eel", 204, 14], ["crabj", 50, 12], ["crabj", 112, 4], ["crabj", 140, 11]],
      npcs: [],
      chests: [{ c: 168, r: 11, reward: { tix: 50 } }],
    },

    {
      name: "CLOUDSPIRE PASS",
      theme: "sky",
      cols: 420,
      spawn: { x: 126, y: 468 },
      goalX: 12510,
      goalY: 13,
      saveX: [3150, 6300, 9450],
      saveY: 29,
      build(g) {
g.ground(30, 0, 3);
        g.ground(17, 4, 7, 19);
        g.ground(30, 4, 7);
        g.ground(17, 8, 15, 19);
        g.ground(31, 8, 15);
        g.ground(31, 16, 17);
        g.ground(16, 18, 29, 18);
        g.ground(31, 18, 29);
        g.ground(31, 30, 31);
        g.ground(16, 32, 43, 18);
        g.ground(31, 32, 43);
        g.ground(31, 44, 45);
        g.ground(17, 46, 57, 19);
        g.ground(31, 46, 57);
        g.ground(31, 58, 59);
        g.ground(16, 60, 71, 18);
        g.ground(31, 60, 71);
        g.ground(31, 72, 73);
        g.ground(17, 74, 85, 19);
        g.ground(31, 74, 85);
        g.ground(31, 86, 87);
        g.ground(17, 88, 99, 19);
        g.ground(31, 88, 99);
        g.ground(31, 100, 101);
        g.ground(16, 102, 113, 18);
        g.ground(31, 102, 113);
        g.ground(31, 114, 115);
        g.ground(16, 116, 127, 18);
        g.ground(31, 116, 127);
        g.ground(31, 128, 129);
        g.ground(17, 130, 137, 19);
        g.ground(31, 130, 137);
        g.ground(31, 138, 138);
        g.ground(17, 139, 141, 19);
        g.ground(31, 139, 141);
        g.ground(31, 142, 143);
        g.ground(16, 144, 155, 18);
        g.ground(31, 144, 155);
        g.ground(31, 156, 157);
        g.ground(17, 158, 169, 19);
        g.ground(31, 158, 169);
        g.ground(31, 170, 171);
        g.ground(17, 172, 183, 19);
        g.ground(31, 172, 183);
        g.ground(31, 184, 185);
        g.ground(16, 186, 197, 18);
        g.ground(31, 186, 197);
        g.ground(31, 198, 199);
        g.ground(16, 200, 211, 18);
        g.ground(31, 200, 211);
        g.ground(31, 212, 213);
        g.ground(17, 214, 225, 19);
        g.ground(31, 214, 225);
        g.ground(31, 226, 227);
        g.ground(16, 228, 239, 18);
        g.ground(31, 228, 239);
        g.ground(31, 240, 241);
        g.ground(17, 242, 253, 19);
        g.ground(31, 242, 253);
        g.ground(31, 254, 255);
        g.ground(17, 256, 259, 19);
        g.ground(31, 256, 259);
        g.ground(31, 260, 260);
        g.ground(17, 261, 267, 19);
        g.ground(31, 261, 267);
        g.ground(31, 268, 269);
        g.ground(16, 270, 281, 18);
        g.ground(31, 270, 281);
        g.ground(31, 282, 283);
        g.ground(16, 284, 295, 18);
        g.ground(31, 284, 295);
        g.ground(31, 296, 297);
        g.ground(17, 298, 309, 19);
        g.ground(31, 298, 309);
        g.ground(31, 310, 311);
        g.ground(16, 312, 323, 18);
        g.ground(31, 312, 323);
        g.ground(31, 324, 325);
        g.ground(17, 326, 337, 19);
        g.ground(31, 326, 337);
        g.ground(31, 338, 339);
        g.ground(17, 340, 351, 19);
        g.ground(31, 340, 351);
        g.ground(31, 352, 353);
        g.ground(16, 354, 365, 18);
        g.ground(31, 354, 365);
        g.ground(31, 366, 367);
        g.ground(16, 368, 379, 18);
        g.ground(31, 368, 379);
        g.ground(31, 380, 381);
        g.ground(17, 382, 385, 19);
        g.ground(31, 382, 385);
        g.ground(31, 386, 386);
        g.ground(17, 387, 393, 19);
        g.ground(31, 387, 393);
        g.ground(31, 394, 395);
        g.ground(16, 396, 407, 18);
        g.ground(31, 396, 407);
        g.ground(31, 408, 409);
        g.ground(15, 410, 412, 15);
        g.ground(31, 410, 412);
        g.ground(15, 413, 413, 15);
        g.ground(18, 413, 413, 19);
        g.ground(30, 413, 413);
        g.ground(15, 414, 417);
        g.ground(14, 418, 419);
        g.door(138, 2, 24, "red");
        g.door(260, 2, 24, "blue");
        g.door(386, 2, 24, "indigo");
        g.shade(360, 408, 0, 34);
        g.platform(7, 53, 60);
        g.platform(7, 108, 115);
        g.platform(7, 163, 170);
        g.platform(7, 218, 225);
        g.platform(7, 273, 280);
        g.platform(7, 328, 335);
        g.platform(15, 16, 17);
        g.platform(15, 30, 31);
        g.platform(15, 44, 45);
        g.platform(15, 58, 59);
        g.platform(15, 72, 73);
        g.platform(15, 100, 101);
        g.platform(15, 114, 115);
        g.platform(15, 128, 129);
        g.platform(15, 142, 143);
        g.platform(15, 156, 157);
        g.platform(15, 184, 185);
        g.platform(15, 198, 199);
        g.platform(15, 212, 213);
        g.platform(15, 226, 227);
        g.platform(15, 240, 241);
        g.platform(15, 268, 269);
        g.platform(15, 282, 283);
        g.platform(15, 296, 297);
        g.platform(15, 310, 311);
        g.platform(15, 324, 325);
        g.platform(15, 352, 353);
        g.platform(15, 366, 367);
        g.platform(15, 380, 381);
        g.platform(15, 394, 395);
        g.platform(15, 408, 409);
        g.platform(16, 86, 87);
        g.platform(16, 170, 171);
        g.platform(16, 254, 255);
        g.platform(16, 338, 339);
        g.cloud(12, 62, 64);
        g.cloud(12, 118, 120);
        g.cloud(12, 230, 232);
        g.cloud(12, 286, 288);
        g.cloud(12, 398, 400);
        g.cloud(13, 6, 8);
        g.cloud(13, 174, 176);
        g.cloud(13, 342, 344);
        g.wind(55, 58, 6, 26, 1500);
        g.wind(110, 113, 6, 26, 1500);
        g.wind(165, 168, 6, 26, 1500);
        g.wind(220, 223, 6, 26, 1500);
        g.wind(275, 278, 6, 26, 1500);
        g.wind(330, 333, 6, 26, 1500);
        g.wind(0, 3, 13, 29, 1500);
      },
      picks: [["key_red", 132, 29], ["key_blue", 254, 28], ["key_indigo", 408, 28], ["ticket", 56, 5], ["ticket", 111, 5], ["ticket", 166, 5], ["ticket", 221, 5], ["ticket", 276, 5], ["ticket", 331, 5], ["ticket", 9, 15], ["ticket", 23, 14], ["ticket", 37, 14], ["ticket", 51, 15], ["ticket", 65, 14], ["ticket", 79, 15], ["ticket", 93, 15], ["ticket", 107, 14], ["ticket", 121, 14], ["ticket", 135, 15], ["ticket", 149, 14], ["ticket", 163, 15], ["ticket", 177, 15], ["ticket", 191, 14], ["ticket", 205, 14], ["ticket", 219, 15], ["ticket", 233, 14], ["ticket", 247, 15], ["ticket", 261, 15], ["ticket", 275, 14], ["ticket", 289, 14], ["ticket", 303, 15], ["ticket", 317, 14], ["ticket", 331, 15], ["ticket", 345, 15], ["ticket", 359, 14], ["ticket", 373, 14], ["ticket", 387, 15], ["ticket", 401, 14], ["feather", 72, 28], ["feather", 200, 10], ["feather", 330, 12], ["starprize", 90, 8], ["starprize", 260, 9], ["conch", 150, 13], ["conch", 360, 13]],
      baddies: [["star", 56, 3], ["star", 111, 3], ["star", 166, 3], ["star", 221, 3], ["star", 276, 3], ["star", 331, 3], ["crabj", 368, 31], ["crabj", 375, 31], ["crabj", 386, 31], ["crabj", 394, 31], ["crabj", 381, 31], ["crabj", 379, 31], ["crabj", 372, 31], ["crabj", 364, 30], ["crabj", 361, 31], ["crabj", 390, 31], ["crabj", 393, 30], ["crabj", 384, 30], ["crabj", 378, 30], ["crabj", 371, 30], ["crabj", 367, 30], ["crab", 257, 29], ["crab", 247, 28], ["crabj", 310, 29], ["crabj", 284, 29], ["crabj", 137, 30], ["crabj", 126, 30]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["Welcome to CLOUDSPIRE PASS — the winds are with you.", "Updrafts carry you high; keep a feather for the gaps."], face: -1 }, { t: "vendor", c: 200, r: 16, name: "Aeri the Wind-Merchant", lines: ["Trade Otter Tickets, traveler of the skies!"], face: -1, trade: true }],
      chests: [{ c: 120, r: 15, reward: { tix: 50 } }, { c: 300, r: 12, reward: { tix: 50 } }],
    },

    {
      name: "SUNKEN DELVES",
      theme: "crypt",
      cols: 420,
      spawn: { x: 150, y: 558 },
      goalX: 12480,
      goalY: 13,
      saveX: [3510, 6930, 10080],
      saveY: 21,
      build(g) {
g.ground(0, 0, 2, 3);
        g.ground(31, 0, 2);
        g.ground(0, 3, 15, 3);
        g.ground(22, 3, 15, 24);
        g.ground(31, 3, 15);
        g.ground(0, 16, 17, 3);
        g.ground(31, 16, 17);
        g.ground(0, 18, 31, 3);
        g.ground(21, 18, 31, 23);
        g.ground(31, 18, 31);
        g.ground(0, 32, 33, 3);
        g.ground(31, 32, 33);
        g.ground(0, 34, 47, 3);
        g.ground(21, 34, 47, 23);
        g.ground(31, 34, 47);
        g.ground(0, 48, 49, 3);
        g.ground(31, 48, 49);
        g.ground(0, 50, 63, 3);
        g.ground(22, 50, 63, 24);
        g.ground(31, 50, 63);
        g.ground(0, 64, 65, 3);
        g.ground(31, 64, 65);
        g.ground(0, 66, 79, 3);
        g.ground(21, 66, 79, 23);
        g.ground(31, 66, 79);
        g.ground(0, 80, 81, 3);
        g.ground(31, 80, 81);
        g.ground(0, 82, 95, 3);
        g.ground(22, 82, 95, 24);
        g.ground(31, 82, 95);
        g.ground(0, 96, 97, 3);
        g.ground(31, 96, 97);
        g.ground(0, 98, 111, 3);
        g.ground(22, 98, 111, 24);
        g.ground(31, 98, 111);
        g.ground(0, 112, 113, 3);
        g.ground(31, 112, 113);
        g.ground(0, 114, 125, 3);
        g.ground(21, 114, 125, 23);
        g.ground(31, 114, 125);
        g.ground(0, 126, 126, 1);
        g.ground(31, 126, 126);
        g.ground(0, 127, 127, 3);
        g.ground(21, 127, 127, 23);
        g.ground(31, 127, 127);
        g.ground(0, 128, 129, 3);
        g.ground(31, 128, 129);
        g.ground(0, 130, 143, 3);
        g.ground(21, 130, 143, 23);
        g.ground(31, 130, 143);
        g.ground(0, 144, 145, 3);
        g.ground(31, 144, 145);
        g.ground(0, 146, 159, 3);
        g.ground(22, 146, 159, 24);
        g.ground(31, 146, 159);
        g.ground(0, 160, 161, 3);
        g.ground(31, 160, 161);
        g.ground(0, 162, 175, 3);
        g.ground(21, 162, 175, 23);
        g.ground(31, 162, 175);
        g.ground(0, 176, 177, 3);
        g.ground(31, 176, 177);
        g.ground(0, 178, 191, 3);
        g.ground(22, 178, 191, 24);
        g.ground(31, 178, 191);
        g.ground(0, 192, 193, 3);
        g.ground(31, 192, 193);
        g.ground(0, 194, 207, 3);
        g.ground(22, 194, 207, 24);
        g.ground(31, 194, 207);
        g.ground(0, 208, 209, 3);
        g.ground(31, 208, 209);
        g.ground(0, 210, 223, 3);
        g.ground(21, 210, 223, 23);
        g.ground(31, 210, 223);
        g.ground(0, 224, 225, 3);
        g.ground(31, 224, 225);
        g.ground(0, 226, 239, 3);
        g.ground(21, 226, 239, 23);
        g.ground(31, 226, 239);
        g.ground(0, 240, 241, 3);
        g.ground(31, 240, 241);
        g.ground(0, 242, 251, 3);
        g.ground(22, 242, 251, 24);
        g.ground(31, 242, 251);
        g.ground(0, 252, 252, 1);
        g.ground(31, 252, 252);
        g.ground(0, 253, 255, 3);
        g.ground(22, 253, 255, 24);
        g.ground(31, 253, 255);
        g.ground(0, 256, 257, 3);
        g.ground(31, 256, 257);
        g.ground(0, 258, 271, 3);
        g.ground(21, 258, 271, 23);
        g.ground(31, 258, 271);
        g.ground(0, 272, 273, 3);
        g.ground(31, 272, 273);
        g.ground(0, 274, 287, 3);
        g.ground(22, 274, 287, 24);
        g.ground(31, 274, 287);
        g.ground(0, 288, 289, 3);
        g.ground(31, 288, 289);
        g.ground(0, 290, 303, 3);
        g.ground(22, 290, 303, 24);
        g.ground(31, 290, 303);
        g.ground(0, 304, 305, 3);
        g.ground(31, 304, 305);
        g.ground(0, 306, 319, 3);
        g.ground(21, 306, 319, 23);
        g.ground(31, 306, 319);
        g.ground(0, 320, 321, 3);
        g.ground(31, 320, 321);
        g.ground(0, 322, 335, 3);
        g.ground(21, 322, 335, 23);
        g.ground(31, 322, 335);
        g.ground(0, 336, 337, 3);
        g.ground(31, 336, 337);
        g.ground(0, 338, 351, 3);
        g.ground(22, 338, 351, 24);
        g.ground(31, 338, 351);
        g.ground(0, 352, 353, 3);
        g.ground(31, 352, 353);
        g.ground(0, 354, 367, 3);
        g.ground(21, 354, 367, 23);
        g.ground(31, 354, 367);
        g.ground(0, 368, 369, 3);
        g.ground(31, 368, 369);
        g.ground(0, 370, 383, 3);
        g.ground(22, 370, 383, 24);
        g.ground(31, 370, 383);
        g.ground(0, 384, 385, 3);
        g.ground(31, 384, 385);
        g.ground(0, 386, 389, 3);
        g.ground(22, 386, 389, 24);
        g.ground(31, 386, 389);
        g.ground(0, 390, 390, 1);
        g.ground(31, 390, 390);
        g.ground(0, 391, 398, 3);
        g.ground(22, 391, 398, 24);
        g.ground(31, 391, 398);
        g.ground(0, 399, 399, 3);
        g.ground(22, 399, 399, 28);
        g.ground(31, 399, 399);
        g.ground(0, 400, 401, 3);
        g.ground(21, 400, 401);
        g.ground(0, 402, 402, 3);
        g.ground(19, 402, 402);
        g.ground(0, 403, 419, 3);
        g.ground(31, 403, 419);
        g.cliff(82, 25, 27);
        g.cliff(162, 24, 26);
        g.cliff(242, 25, 27);
        g.cliff(322, 24, 26);
        g.door(126, 2, 26, "yellow");
        g.door(252, 2, 26, "green");
        g.door(390, 2, 26, "orange");
        g.platform(20, 16, 17);
        g.platform(20, 32, 33);
        g.platform(20, 48, 49);
        g.platform(20, 64, 65);
        g.platform(20, 80, 81);
        g.platform(20, 112, 113);
        g.platform(20, 128, 129);
        g.platform(20, 144, 145);
        g.platform(20, 160, 161);
        g.platform(20, 176, 177);
        g.platform(20, 208, 209);
        g.platform(20, 224, 225);
        g.platform(20, 240, 241);
        g.platform(20, 256, 257);
        g.platform(20, 272, 273);
        g.platform(20, 304, 305);
        g.platform(20, 320, 321);
        g.platform(20, 336, 337);
        g.platform(20, 352, 353);
        g.platform(20, 368, 369);
        g.platform(20, 400, 401);
        g.platform(21, 96, 97);
        g.platform(21, 192, 193);
        g.platform(21, 288, 289);
        g.platform(21, 384, 385);
        g.water(90, 118, 26);
        g.water(205, 240, 26);
        g.water(330, 362, 26);
        g.current(92, 116, 28, 33, 90, 0);
        g.current(208, 238, 28, 33, -80, 0);
        g.wind(0, 2, 5, 30, 1500);
      },
      picks: [["key_yellow", 118, 28], ["key_green", 240, 29], ["key_orange", 385, 28], ["bubble", 95, 27], ["bubble", 103, 28], ["ticket", 98, 28], ["ticket", 107, 27], ["ticket", 115, 28], ["bubble", 215, 27], ["bubble", 223, 28], ["ticket", 218, 28], ["ticket", 227, 27], ["ticket", 235, 28], ["bubble", 340, 27], ["bubble", 348, 28], ["ticket", 343, 28], ["ticket", 352, 27], ["ticket", 360, 28], ["ticket", 8, 20], ["ticket", 24, 19], ["ticket", 40, 19], ["ticket", 56, 20], ["ticket", 72, 19], ["ticket", 88, 20], ["ticket", 104, 20], ["ticket", 120, 19], ["ticket", 136, 19], ["ticket", 152, 20], ["ticket", 168, 19], ["ticket", 184, 20], ["ticket", 200, 20], ["ticket", 216, 19], ["ticket", 232, 19], ["ticket", 248, 20], ["ticket", 264, 19], ["ticket", 280, 20], ["ticket", 296, 20], ["ticket", 312, 19], ["ticket", 328, 19], ["ticket", 344, 20], ["ticket", 360, 19], ["ticket", 376, 20], ["ticket", 392, 20], ["feather", 59, 28], ["feather", 200, 18], ["feather", 330, 18], ["starprize", 130, 18], ["starprize", 290, 18], ["conch", 160, 14], ["conch", 380, 14]],
      baddies: [["jelly", 101, 29], ["eel", 107, 28], ["jelly", 221, 29], ["eel", 227, 28], ["jelly", 346, 29], ["eel", 352, 28], ["crab", 40, 21], ["crabj", 54, 21], ["star", 47, 18], ["crab", 80, 21], ["crabj", 94, 21], ["star", 87, 18], ["crab", 120, 21], ["crabj", 134, 21], ["star", 127, 18], ["crab", 160, 21], ["crabj", 174, 21], ["star", 167, 18], ["crab", 200, 21], ["crabj", 214, 21], ["star", 207, 18], ["crab", 240, 21], ["crabj", 254, 21], ["star", 247, 18], ["crab", 280, 21], ["crabj", 294, 21], ["star", 287, 18], ["crab", 320, 21], ["crabj", 334, 21], ["star", 327, 18], ["crab", 360, 21], ["crabj", 374, 21], ["star", 367, 18], ["jelly", 114, 27], ["jelly", 210, 27], ["jelly", 234, 27], ["jelly", 331, 27], ["jelly", 358, 27], ["crabj", 308, 30], ["crabj", 265, 30], ["crabj", 248, 30], ["crabj", 290, 30]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["SUNKEN DELVES — mind the currents in the pools.", "Grab bubbles to breathe; the keys hide in the dark."], face: -1 }, { t: "vendor", c: 260, r: 22, name: "Gloom the Cavern-Keep", lines: ["Shhh... the deep listens. Trade? I have shells."], face: -1, trade: true }],
      chests: [{ c: 120, r: 21, reward: { tix: 50 } }, { c: 330, r: 21, reward: { tix: 50 } }],
    },

    {
      name: "STORMCREST SPIRE",
      theme: "sky",
      cols: 440,
      spawn: { x: 150, y: 558 },
      goalX: 13110,
      goalY: 13,
      saveX: [3300, 6600, 9900],
      saveY: 19,
      build(g) {
g.ground(31, 0, 3);
        g.ground(20, 4, 71, 22);
        g.ground(31, 4, 71);
        g.ground(21, 72, 82, 23);
        g.ground(31, 72, 82);
        g.ground(22, 83, 95, 24);
        g.ground(31, 83, 95);
        g.ground(21, 96, 105, 23);
        g.ground(31, 96, 105);
        g.ground(20, 106, 128, 22);
        g.ground(31, 106, 128);
        g.ground(19, 129, 131, 21);
        g.ground(31, 129, 131);
        g.ground(31, 132, 132);
        g.ground(19, 133, 151, 21);
        g.ground(31, 133, 151);
        g.ground(20, 152, 164, 22);
        g.ground(31, 152, 164);
        g.ground(21, 165, 184, 23);
        g.ground(31, 165, 184);
        g.ground(20, 185, 197, 22);
        g.ground(31, 185, 197);
        g.ground(21, 198, 207, 23);
        g.ground(31, 198, 207);
        g.ground(20, 208, 246, 22);
        g.ground(31, 208, 246);
        g.ground(19, 247, 260, 21);
        g.ground(31, 247, 260);
        g.ground(20, 261, 263, 22);
        g.ground(31, 261, 263);
        g.ground(31, 264, 264);
        g.ground(20, 265, 271, 22);
        g.ground(31, 265, 271);
        g.ground(19, 272, 280, 21);
        g.ground(31, 272, 280);
        g.ground(20, 281, 314, 22);
        g.ground(31, 281, 314);
        g.ground(19, 315, 326, 21);
        g.ground(31, 315, 326);
        g.ground(18, 327, 371, 20);
        g.ground(31, 327, 371);
        g.ground(19, 372, 373, 21);
        g.ground(31, 372, 373);
        g.ground(31, 374, 374);
        g.ground(19, 375, 382, 21);
        g.ground(31, 375, 382);
        g.ground(20, 383, 403, 22);
        g.ground(31, 383, 403);
        g.ground(21, 404, 412, 23);
        g.ground(31, 404, 412);
        g.ground(20, 413, 427, 22);
        g.ground(31, 413, 427);
        g.ground(20, 428, 428, 22);
        g.ground(25, 428, 428, 25);
        g.ground(31, 428, 428);
        g.ground(20, 429, 433);
        g.ground(31, 434, 439);
        g.door(132, 2, 24, "orange");
        g.door(264, 2, 24, "violet");
        g.door(374, 2, 24, "red");
        g.shade(352, 428, 0, 34);
        g.platform(7, 48, 53);
        g.platform(7, 105, 110);
        g.platform(7, 164, 169);
        g.platform(7, 220, 225);
        g.platform(7, 280, 285);
        g.platform(7, 337, 342);
        g.platform(7, 392, 397);
        g.cloud(14, 353, 356);
        g.cloud(15, 142, 145);
        g.cloud(15, 248, 251);
        g.cloud(15, 316, 319);
        g.cloud(16, 3, 6);
        g.cloud(16, 41, 44);
        g.cloud(16, 107, 110);
        g.cloud(16, 209, 212);
        g.cloud(16, 282, 285);
        g.cloud(16, 384, 387);
        g.cloud(16, 414, 417);
        g.cloud(17, 73, 76);
        g.cloud(17, 176, 179);
        g.wind(49, 52, 6, 19, 1500);
        g.wind(106, 109, 6, 19, 1500);
        g.wind(165, 168, 6, 20, 1500);
        g.wind(221, 224, 6, 19, 1500);
        g.wind(281, 284, 6, 19, 1500);
        g.wind(338, 341, 6, 17, 1500);
        g.wind(393, 396, 6, 19, 1500);
        g.wind(0, 3, 5, 30, 1500);
      },
      picks: [["key_orange", 129, 27], ["key_violet", 426, 28], ["key_red", 286, 6], ["ticket", 7, 18], ["ticket", 19, 18], ["ticket", 32, 18], ["ticket", 44, 18], ["ticket", 54, 18], ["ticket", 66, 18], ["ticket", 77, 19], ["ticket", 89, 20], ["ticket", 100, 19], ["ticket", 111, 18], ["ticket", 122, 18], ["ticket", 134, 17], ["ticket", 146, 17], ["ticket", 158, 18], ["ticket", 169, 19], ["ticket", 179, 19], ["ticket", 191, 18], ["ticket", 202, 19], ["ticket", 214, 18], ["ticket", 226, 18], ["ticket", 239, 18], ["ticket", 253, 17], ["ticket", 266, 18], ["ticket", 276, 17], ["ticket", 286, 18], ["ticket", 296, 18], ["ticket", 308, 18], ["ticket", 320, 17], ["ticket", 332, 16], ["ticket", 344, 16], ["ticket", 357, 16], ["ticket", 367, 16], ["ticket", 377, 17], ["ticket", 387, 18], ["ticket", 398, 18], ["ticket", 408, 19], ["ticket", 418, 18], ["ticket", 429, 18], ["ticket", 173, 18], ["ticket", 386, 18], ["ticket", 354, 18], ["ticket", 269, 18], ["ticket", 186, 18], ["ticket", 379, 18], ["ticket", 253, 18], ["ticket", 195, 18], ["feather", 30, 17], ["feather", 150, 17], ["feather", 260, 17], ["feather", 370, 17], ["conch", 176, 16], ["conch", 374, 16], ["starprize", 220, 15], ["feather", 10, 28]],
      baddies: [["crab", 19, 19], ["star", 19, 16], ["crabj", 35, 19], ["crab", 44, 19], ["crabj", 47, 19], ["star", 54, 16], ["star", 89, 18], ["crabj", 114, 19], ["star", 111, 16], ["crabj", 149, 18], ["star", 146, 15], ["crab", 169, 20], ["crab", 179, 20], ["crab", 191, 19], ["crabj", 205, 20], ["crabj", 229, 19], ["crab", 239, 19], ["crabj", 242, 19], ["crab", 253, 18], ["crabj", 256, 18], ["star", 276, 15], ["crab", 286, 19], ["crab", 296, 19], ["star", 296, 16], ["crab", 308, 19], ["star", 308, 16], ["crab", 320, 18], ["crab", 332, 17], ["crabj", 347, 17], ["crab", 357, 17], ["star", 367, 14], ["crab", 377, 18], ["crabj", 380, 18], ["crab", 387, 19], ["star", 387, 16], ["crabj", 411, 20], ["star", 408, 17], ["star", 16, 28], ["star", 40, 28], ["star", 31, 29], ["star", 50, 28], ["star", 62, 27], ["star", 76, 28], ["star", 97, 28], ["star", 120, 28], ["star", 133, 29], ["star", 162, 28], ["star", 171, 27], ["star", 151, 28], ["star", 207, 28], ["star", 189, 28], ["star", 237, 28], ["star", 246, 28], ["star", 223, 27], ["star", 264, 29], ["star", 276, 28], ["star", 310, 27], ["star", 348, 27], ["star", 356, 27], ["star", 380, 27], ["star", 412, 28], ["star", 428, 28], ["star", 427, 25], ["jelly", 360, 27], ["jelly", 372, 27], ["jelly", 401, 26], ["jelly", 390, 26], ["jelly", 416, 26], ["crabj", 294, 30], ["crabj", 254, 30], ["crabj", 272, 29], ["crabj", 215, 30], ["crabj", 157, 29], ["crabj", 142, 31], ["crabj", 109, 30], ["crabj", 46, 30], ["crabj", 23, 30], ["crab", 36, 30], ["crab", 64, 30], ["crab", 87, 30], ["crab", 129, 30], ["crab", 126, 27], ["crab", 122, 24], ["crab", 169, 30], ["crab", 185, 30], ["crab", 202, 30], ["crab", 324, 30], ["crab", 335, 29]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["STORMCREST SPIRE — updrafts surge here. Ride them or be dashed."], face: -1 }, { t: "vendor", c: 220, r: 19, name: "Bora the Storm-Trader", lines: ["Otter Tickets for wares, friend."], face: -1, trade: true }],
      chests: [{ c: 132, r: 19, reward: { tix: 50 } }, { c: 316, r: 19, reward: { tix: 50 } }],
    },

    {
      name: "DROWNED HALLS",
      theme: "abyss",
      underwater: true,
      cols: 440,
      spawn: { x: 150, y: 558 },
      goalX: 13110,
      goalY: 3,
      saveX: [3300, 6600, 9900],
      saveY: 19,
      build(g) {
g.water(0, 439, 0);
g.ground(20, 0, 1, 20);
        g.ground(31, 0, 1);
        g.ground(20, 2, 10, 22);
        g.ground(31, 2, 10);
        g.ground(19, 11, 22);
        g.ground(18, 23, 23, 20);
        g.ground(31, 23, 23);
        g.ground(18, 24, 24, 18);
        g.ground(31, 24, 24);
        g.ground(18, 25, 32, 20);
        g.ground(31, 25, 32);
        g.ground(17, 33, 44, 19);
        g.ground(31, 33, 44);
        g.ground(18, 45, 57);
        g.ground(17, 58, 71, 19);
        g.ground(31, 58, 71);
        g.ground(17, 72, 72, 17);
        g.ground(31, 72, 72);
        g.ground(17, 73, 79, 19);
        g.ground(31, 73, 79);
        g.ground(18, 80, 93);
        g.ground(18, 94, 99, 20);
        g.ground(31, 94, 99);
        g.ground(31, 100, 102);
        g.ground(18, 103, 106, 20);
        g.ground(31, 103, 106);
        g.ground(17, 107, 117, 19);
        g.ground(31, 107, 117);
        g.ground(17, 118, 118);
        g.ground(17, 119, 119, 17);
        g.ground(20, 119, 119);
        g.ground(17, 120, 131);
        g.ground(17, 132, 139, 19);
        g.ground(31, 132, 139);
        g.ground(31, 140, 140);
        g.ground(17, 141, 144, 19);
        g.ground(31, 141, 144);
        g.ground(31, 145, 146);
        g.ground(17, 147, 155, 19);
        g.ground(31, 147, 155);
        g.ground(18, 156, 164);
        g.ground(19, 165, 165, 21);
        g.ground(31, 165, 165);
        g.ground(31, 166, 167);
        g.ground(19, 168, 189, 21);
        g.ground(31, 168, 189);
        g.ground(20, 190, 203);
        g.ground(21, 204, 204, 23);
        g.ground(31, 204, 204);
        g.ground(31, 205, 206);
        g.ground(21, 207, 215, 23);
        g.ground(31, 207, 215);
        g.ground(22, 216, 216, 24);
        g.ground(31, 216, 216);
        g.ground(22, 217, 217, 22);
        g.ground(31, 217, 217);
        g.ground(22, 218, 228, 24);
        g.ground(31, 218, 228);
        g.ground(21, 229, 238);
        g.ground(21, 239, 247, 23);
        g.ground(31, 239, 247);
        g.ground(21, 248, 248, 22);
        g.ground(31, 248, 248);
        g.ground(31, 249, 250);
        g.ground(21, 251, 252, 23);
        g.ground(31, 251, 252);
        g.ground(22, 253, 265, 24);
        g.ground(31, 253, 265);
        g.ground(22, 266, 266);
        g.ground(22, 267, 267, 22);
        g.ground(25, 267, 267);
        g.ground(22, 268, 275);
        g.ground(23, 276, 280, 25);
        g.ground(31, 276, 280);
        g.ground(25, 281, 281, 25);
        g.ground(31, 281, 281);
        g.ground(23, 282, 298, 25);
        g.ground(31, 282, 298);
        g.ground(22, 299, 311);
        g.ground(23, 312, 312, 25);
        g.ground(31, 312, 312);
        g.ground(23, 313, 313, 23);
        g.ground(31, 313, 313);
        g.ground(23, 314, 324, 25);
        g.ground(31, 314, 324);
        g.ground(22, 325, 336, 24);
        g.ground(31, 325, 336);
        g.ground(22, 337, 349);
        g.ground(22, 350, 359, 24);
        g.ground(31, 350, 359);
        g.ground(21, 360, 360, 23);
        g.ground(31, 360, 360);
        g.ground(21, 361, 361, 21);
        g.ground(31, 361, 361);
        g.ground(21, 362, 368, 23);
        g.ground(31, 362, 368);
        g.ground(20, 369, 380);
        g.ground(19, 381, 392, 21);
        g.ground(31, 381, 392);
        g.ground(20, 393, 405, 22);
        g.ground(31, 393, 405);
        g.ground(19, 406, 406);
        g.ground(19, 407, 407, 19);
        g.ground(22, 407, 407);
        g.ground(19, 408, 415);
        g.ground(20, 416, 427, 22);
        g.ground(31, 416, 427);
        g.ground(19, 428, 436, 21);
        g.ground(31, 428, 436);
        g.ground(31, 437, 439);
        g.cliff(24, 19, 20);
        g.cliff(72, 18, 19);
        g.cliff(119, 18, 19);
        g.cliff(217, 23, 24);
        g.cliff(267, 23, 24);
        g.cliff(313, 24, 25);
        g.cliff(361, 22, 23);
        g.cliff(407, 20, 21);
        g.door(140, 2, 24, "green");
        g.door(281, 2, 24, "indigo");
      },
      picks: [["key_indigo", 277, 19], ["ticket", 6, 18], ["ticket", 16, 17], ["bubble", 13, 20], ["bubble", 20, 21], ["ticket", 16, 21], ["ticket", 27, 16], ["ticket", 38, 15], ["ticket", 51, 16], ["bubble", 47, 19], ["bubble", 55, 20], ["ticket", 51, 20], ["ticket", 64, 15], ["ticket", 75, 15], ["ticket", 86, 16], ["bubble", 82, 19], ["bubble", 91, 20], ["ticket", 86, 20], ["ticket", 100, 16], ["ticket", 112, 15], ["ticket", 124, 15], ["bubble", 120, 18], ["bubble", 129, 19], ["ticket", 124, 19], ["ticket", 138, 15], ["ticket", 150, 15], ["ticket", 160, 16], ["bubble", 158, 19], ["bubble", 162, 20], ["ticket", 160, 20], ["ticket", 170, 17], ["ticket", 182, 17], ["ticket", 196, 18], ["bubble", 192, 21], ["bubble", 201, 22], ["ticket", 196, 22], ["ticket", 209, 19], ["ticket", 222, 20], ["ticket", 233, 19], ["bubble", 231, 22], ["bubble", 236, 23], ["ticket", 233, 23], ["ticket", 245, 19], ["ticket", 259, 20], ["ticket", 270, 20], ["bubble", 268, 23], ["bubble", 273, 24], ["ticket", 270, 24], ["ticket", 280, 21], ["ticket", 292, 21], ["ticket", 305, 20], ["bubble", 301, 23], ["bubble", 309, 24], ["ticket", 305, 24], ["ticket", 318, 21], ["ticket", 330, 20], ["ticket", 343, 20], ["bubble", 339, 23], ["bubble", 347, 24], ["ticket", 343, 24], ["ticket", 354, 20], ["ticket", 364, 19], ["ticket", 374, 18], ["bubble", 371, 21], ["bubble", 378, 22], ["ticket", 374, 22], ["ticket", 386, 17], ["ticket", 399, 18], ["ticket", 410, 17], ["bubble", 408, 20], ["bubble", 413, 21], ["ticket", 410, 21], ["ticket", 421, 18], ["ticket", 432, 17], ["ticket", 308, 18], ["ticket", 348, 18], ["ticket", 298, 18], ["ticket", 38, 18], ["ticket", 93, 18], ["ticket", 281, 18], ["ticket", 269, 18], ["ticket", 113, 18], ["ticket", 187, 18], ["ticket", 121, 18], ["ticket", 119, 18], ["ticket", 241, 18], ["feather", 40, 17], ["feather", 200, 17], ["feather", 330, 17], ["conch", 176, 16], ["conch", 374, 16], ["starprize", 220, 15], ["key_green", 97, 25], ["key_violet", 188, 28]],
      baddies: [["crabj", 19, 18], ["jelly", 14, 20], ["eel", 19, 20], ["crab", 51, 17], ["crabj", 54, 17], ["jelly", 48, 19], ["crabj", 78, 16], ["crab", 86, 17], ["jelly", 83, 19], ["eel", 90, 19], ["crabj", 103, 17], ["crab", 112, 16], ["crabj", 115, 16], ["star", 112, 13], ["star", 124, 13], ["jelly", 121, 18], ["crab", 138, 16], ["crabj", 141, 16], ["crab", 150, 16], ["star", 160, 14], ["jelly", 159, 19], ["crab", 170, 18], ["crab", 182, 18], ["crab", 196, 19], ["jelly", 193, 21], ["eel", 200, 21], ["crab", 209, 20], ["crab", 222, 21], ["crabj", 225, 21], ["star", 222, 18], ["crabj", 236, 20], ["jelly", 232, 22], ["crab", 245, 20], ["star", 259, 18], ["crabj", 273, 21], ["eel", 272, 23], ["crabj", 295, 22], ["star", 292, 19], ["crab", 305, 21], ["eel", 308, 23], ["crab", 318, 22], ["star", 318, 19], ["crab", 330, 21], ["crabj", 333, 21], ["crab", 343, 21], ["star", 343, 18], ["eel", 346, 23], ["crab", 354, 21], ["crabj", 357, 21], ["crabj", 367, 20], ["crab", 374, 19], ["crabj", 377, 19], ["eel", 377, 21], ["crab", 386, 18], ["crab", 399, 19], ["crabj", 402, 19], ["crab", 410, 18], ["star", 410, 15], ["eel", 412, 20], ["jelly", 20, 18], ["jelly", 46, 18], ["eel", 54, 20], ["jelly", 72, 18], ["eel", 80, 20], ["jelly", 98, 18], ["eel", 106, 20], ["jelly", 124, 18], ["jelly", 150, 18], ["eel", 158, 20], ["jelly", 176, 18], ["jelly", 202, 18], ["jelly", 228, 18], ["jelly", 254, 18], ["eel", 262, 20], ["jelly", 280, 18], ["jelly", 306, 18], ["eel", 314, 20], ["jelly", 332, 18], ["eel", 340, 20], ["jelly", 358, 18], ["eel", 366, 20], ["jelly", 384, 18], ["eel", 392, 20], ["jelly", 410, 18], ["eel", 418, 20], ["crabj", 165, 30], ["crabj", 167, 30], ["crabj", 169, 30], ["crabj", 171, 30], ["crabj", 174, 30], ["crabj", 177, 30], ["crabj", 179, 30], ["crabj", 182, 30], ["crabj", 185, 30], ["crabj", 187, 30], ["crabj", 189, 30], ["crabj", 204, 30], ["crabj", 206, 30], ["crabj", 209, 30], ["crabj", 212, 30], ["crabj", 216, 30], ["crabj", 223, 30], ["crabj", 225, 30], ["crabj", 228, 30], ["crabj", 219, 30], ["jelly", 240, 26], ["jelly", 244, 26], ["jelly", 249, 27], ["jelly", 250, 27], ["jelly", 257, 26], ["jelly", 261, 26], ["jelly", 264, 26], ["jelly", 262, 28], ["jelly", 258, 29], ["jelly", 255, 29], ["jelly", 254, 29], ["jelly", 243, 28]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["DROWNED HALLS — the tide swallowed these halls whole."], face: -1 }, { t: "vendor", c: 220, r: 19, name: "Maribel the Deep-Scribe", lines: ["Otter Tickets for wares, friend."], face: -1, trade: true }],
      chests: [{ c: 153, r: 28, reward: { tix: 50 } }, { c: 316, r: 19, reward: { tix: 50 } }],
    },

    {
      name: "CRYSTAL CAVERNS",
      theme: "crypt",
      cols: 440,
      spawn: { x: 150, y: 618 },
      goalX: 13110,
      saveX: [3300, 6600, 9900],
      saveY: 21,
      build(g) {
g.ground(0, 0, 439, 3);
g.ground(31, 0, 439);
g.ground(22, 2, 13, 24);
g.ground(23, 14, 22, 30);
g.water(14, 22, 23);
g.ground(24, 23, 32, 26);
g.cliff(24, 25, 26);
g.ground(24, 33, 42, 26);
g.ground(25, 43, 54, 30);
g.water(43, 54, 25);
g.ground(25, 55, 66, 27);
g.ground(25, 67, 76, 27);
g.cliff(68, 26, 27);
g.ground(25, 77, 90, 30);
g.water(77, 90, 25);
g.ground(25, 91, 104, 27);
g.ground(24, 105, 116, 26);
g.ground(25, 117, 125, 30);
g.water(117, 125, 25);
g.cliff(118, 26, 27);
g.ground(25, 126, 134, 27);
g.ground(25, 135, 144, 27);
g.ground(25, 145, 154, 30);
g.water(145, 154, 25);
g.ground(25, 155, 165, 27);
g.cliff(156, 26, 27);
g.ground(25, 166, 179, 27);
g.ground(25, 180, 190, 30);
g.water(180, 190, 25);
g.ground(25, 191, 199, 27);
g.ground(25, 200, 213, 27);
g.cliff(201, 26, 27);
g.ground(24, 214, 223, 30);
g.water(214, 223, 24);
g.ground(24, 224, 236, 26);
g.ground(23, 237, 250, 25);
g.ground(22, 251, 260, 30);
g.water(251, 260, 22);
g.cliff(252, 23, 24);
g.ground(23, 261, 269, 25);
g.ground(23, 270, 283, 25);
g.ground(24, 284, 292, 30);
g.water(284, 292, 24);
g.ground(23, 293, 302, 25);
g.cliff(294, 24, 25);
g.ground(24, 303, 314, 26);
g.ground(24, 315, 327, 30);
g.water(315, 327, 24);
g.ground(25, 328, 338, 27);
g.ground(24, 339, 349, 26);
g.cliff(340, 25, 26);
g.ground(25, 350, 361, 30);
g.water(350, 361, 25);
g.ground(24, 362, 370, 26);
g.ground(23, 371, 383, 25);
g.ground(23, 384, 394, 30);
g.water(384, 394, 23);
g.cliff(385, 24, 25);
g.ground(24, 395, 407, 26);
g.ground(25, 408, 418, 27);
g.ground(25, 419, 427, 30);
g.water(419, 427, 25);
g.ground(24, 428, 436, 26);
g.cliff(429, 25, 26);
g.door(123, 2, 24, "blue");
g.door(255, 2, 24, "yellow");
g.door(360, 2, 24, "red");
      },
      picks: [["key_blue", 119, 21], ["key_yellow", 251, 21], ["key_red", 356, 21], ["ticket", 7, 20], ["ticket", 18, 21], ["bubble", 16, 24], ["bubble", 20, 25], ["ticket", 18, 25], ["ticket", 27, 22], ["ticket", 37, 22], ["ticket", 48, 23], ["bubble", 45, 26], ["bubble", 52, 27], ["ticket", 48, 27], ["ticket", 60, 23], ["ticket", 71, 23], ["ticket", 83, 23], ["bubble", 79, 26], ["bubble", 88, 27], ["ticket", 83, 27], ["ticket", 97, 23], ["ticket", 110, 22], ["ticket", 121, 23], ["bubble", 119, 26], ["bubble", 123, 27], ["ticket", 121, 27], ["ticket", 130, 23], ["ticket", 139, 23], ["ticket", 149, 23], ["bubble", 147, 26], ["bubble", 152, 27], ["ticket", 149, 27], ["ticket", 160, 23], ["ticket", 172, 23], ["ticket", 185, 23], ["bubble", 182, 26], ["bubble", 188, 27], ["ticket", 185, 27], ["ticket", 195, 23], ["ticket", 206, 23], ["ticket", 218, 22], ["bubble", 216, 25], ["bubble", 221, 26], ["ticket", 218, 26], ["ticket", 230, 22], ["ticket", 243, 21], ["ticket", 255, 20], ["bubble", 253, 23], ["bubble", 258, 24], ["ticket", 255, 24], ["ticket", 265, 21], ["ticket", 276, 21], ["ticket", 288, 22], ["bubble", 286, 25], ["bubble", 290, 26], ["ticket", 288, 26], ["ticket", 297, 21], ["ticket", 308, 22], ["ticket", 321, 22], ["bubble", 317, 25], ["bubble", 325, 26], ["ticket", 321, 26], ["ticket", 333, 23], ["ticket", 344, 22], ["ticket", 355, 23], ["bubble", 352, 26], ["bubble", 359, 27], ["ticket", 355, 27], ["ticket", 366, 22], ["ticket", 377, 21], ["ticket", 389, 21], ["bubble", 386, 24], ["bubble", 392, 25], ["ticket", 389, 25], ["ticket", 401, 22], ["ticket", 413, 23], ["ticket", 423, 23], ["bubble", 421, 26], ["bubble", 425, 27], ["ticket", 423, 27], ["ticket", 432, 22], ["ticket", 166, 20], ["ticket", 133, 20], ["ticket", 175, 20], ["ticket", 33, 20], ["ticket", 381, 20], ["ticket", 301, 20], ["ticket", 34, 20], ["ticket", 45, 20], ["ticket", 131, 20], ["ticket", 174, 20], ["feather", 70, 19], ["feather", 210, 19], ["feather", 350, 19], ["conch", 176, 18], ["conch", 374, 18], ["starprize", 220, 17]],
      baddies: [["crab", 18, 22], ["star", 18, 19], ["jelly", 17, 24], ["crab", 37, 23], ["crabj", 40, 23], ["star", 37, 20], ["crab", 48, 24], ["jelly", 46, 26], ["eel", 51, 26], ["crab", 71, 24], ["crab", 83, 24], ["jelly", 80, 26], ["eel", 87, 26], ["crabj", 100, 24], ["crab", 110, 23], ["crabj", 113, 23], ["star", 110, 20], ["star", 121, 21], ["jelly", 120, 26], ["eel", 122, 26], ["crab", 130, 24], ["star", 130, 21], ["crab", 139, 24], ["crab", 149, 24], ["star", 149, 21], ["jelly", 148, 26], ["eel", 151, 26], ["crab", 172, 24], ["jelly", 183, 26], ["crabj", 198, 24], ["star", 218, 20], ["jelly", 217, 25], ["eel", 220, 25], ["crabj", 246, 22], ["star", 243, 19], ["crab", 255, 21], ["jelly", 254, 23], ["crab", 276, 22], ["jelly", 287, 25], ["crabj", 300, 22], ["star", 297, 19], ["crab", 308, 23], ["jelly", 318, 25], ["crab", 355, 24], ["crabj", 358, 24], ["star", 355, 21], ["star", 366, 20], ["crab", 389, 22], ["star", 389, 19], ["jelly", 387, 24], ["crabj", 404, 23], ["crab", 413, 24]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["CRYSTAL CAVERNS — climb the glittering walls."], face: -1 }, { t: "vendor", c: 220, r: 21, name: "Pru the Gemcutter", face: -1, trade: true, lines: ["Otter Tickets for wares, friend."] }],
      chests: [{ c: 132, r: 21, reward: { tix: 50 } }, { c: 316, r: 21, reward: { tix: 50 } }],
    },

    {
      name: "EMBER ISLES",
      theme: "falls",
      cols: 440,
      spawn: { x: 150, y: 588 },
      goalX: 13110,
      saveX: [3300, 6600, 9900],
      saveY: 20,
      build(g) {
g.ground(31, 0, 439);
g.ground(21, 2, 10, 23);
g.cloud(17, 3, 6);
g.ground(22, 11, 19, 30);
g.water(11, 19, 22);
g.ground(23, 20, 28, 25);
g.ground(23, 29, 37, 25);
g.cloud(19, 30, 33);
g.ground(24, 38, 49, 30);
g.water(38, 49, 24);
g.ground(24, 50, 61, 26);
g.ground(24, 62, 74, 26);
g.cloud(20, 63, 66);
g.ground(24, 75, 88, 30);
g.water(75, 88, 24);
g.ground(24, 89, 97, 26);
g.ground(24, 98, 106, 26);
g.cloud(20, 99, 102);
g.ground(24, 107, 117, 30);
g.water(107, 117, 24);
g.ground(24, 118, 130, 26);
g.ground(24, 131, 140, 26);
g.cloud(20, 132, 135);
g.ground(24, 141, 151, 30);
g.water(141, 151, 24);
g.ground(23, 152, 160, 25);
g.ground(23, 161, 170, 25);
g.cloud(19, 162, 165);
g.ground(22, 171, 183, 30);
g.water(171, 183, 22);
g.ground(21, 184, 196, 23);
g.ground(22, 197, 205, 24);
g.cloud(18, 198, 201);
g.ground(23, 206, 219, 30);
g.water(206, 219, 23);
g.ground(23, 220, 228, 25);
g.ground(22, 229, 238, 24);
g.cloud(18, 230, 233);
g.ground(23, 239, 247, 30);
g.water(239, 247, 23);
g.ground(24, 248, 259, 26);
g.ground(24, 260, 272, 26);
g.cloud(20, 261, 264);
g.ground(23, 273, 286, 30);
g.water(273, 286, 23);
g.ground(24, 287, 300, 26);
g.ground(24, 301, 310, 26);
g.cloud(20, 302, 305);
g.ground(24, 311, 323, 30);
g.water(311, 323, 24);
g.ground(24, 324, 334, 26);
g.ground(23, 335, 346, 25);
g.cloud(19, 336, 339);
g.ground(22, 347, 360, 30);
g.water(347, 360, 22);
g.ground(22, 361, 374, 24);
g.ground(21, 375, 384, 23);
g.cloud(17, 376, 379);
g.ground(21, 385, 397, 30);
g.water(385, 397, 21);
g.ground(20, 398, 407, 22);
g.ground(19, 408, 418, 21);
g.cloud(15, 409, 412);
g.ground(18, 419, 431, 30);
g.water(419, 431, 18);
g.ground(18, 432, 436, 20);
g.door(154, 2, 24, "violet");
g.door(299, 2, 24, "orange");
      },
      picks: [["key_violet", 150, 20], ["key_orange", 295, 20], ["ticket", 6, 19], ["ticket", 15, 20], ["bubble", 13, 23], ["bubble", 17, 24], ["ticket", 15, 24], ["ticket", 24, 21], ["ticket", 33, 21], ["ticket", 43, 22], ["bubble", 40, 25], ["bubble", 47, 26], ["ticket", 43, 26], ["ticket", 55, 22], ["ticket", 68, 22], ["ticket", 81, 22], ["bubble", 77, 25], ["bubble", 86, 26], ["ticket", 81, 26], ["ticket", 93, 22], ["ticket", 102, 22], ["ticket", 112, 22], ["bubble", 109, 25], ["bubble", 115, 26], ["ticket", 112, 26], ["ticket", 124, 22], ["ticket", 135, 22], ["ticket", 146, 22], ["bubble", 143, 25], ["bubble", 149, 26], ["ticket", 146, 26], ["ticket", 156, 21], ["ticket", 165, 21], ["ticket", 177, 20], ["bubble", 173, 23], ["bubble", 181, 24], ["ticket", 177, 24], ["ticket", 190, 19], ["ticket", 201, 20], ["ticket", 212, 21], ["bubble", 208, 24], ["bubble", 217, 25], ["ticket", 212, 25], ["ticket", 224, 21], ["ticket", 233, 20], ["ticket", 243, 21], ["bubble", 241, 24], ["bubble", 245, 25], ["ticket", 243, 25], ["ticket", 253, 22], ["ticket", 266, 22], ["ticket", 279, 21], ["bubble", 275, 24], ["bubble", 284, 25], ["ticket", 279, 25], ["ticket", 293, 22], ["ticket", 305, 22], ["ticket", 317, 22], ["bubble", 313, 25], ["bubble", 321, 26], ["ticket", 317, 26], ["ticket", 329, 22], ["ticket", 340, 21], ["ticket", 353, 20], ["bubble", 349, 23], ["bubble", 358, 24], ["ticket", 353, 24], ["ticket", 367, 20], ["ticket", 379, 19], ["ticket", 391, 19], ["bubble", 387, 22], ["bubble", 395, 23], ["ticket", 391, 23], ["ticket", 402, 18], ["ticket", 413, 17], ["ticket", 425, 16], ["bubble", 421, 19], ["bubble", 429, 20], ["ticket", 425, 20], ["ticket", 434, 16], ["ticket", 185, 19], ["ticket", 183, 19], ["ticket", 137, 19], ["ticket", 253, 19], ["ticket", 409, 19], ["ticket", 216, 19], ["ticket", 101, 19], ["ticket", 335, 19], ["ticket", 408, 19], ["feather", 50, 18], ["feather", 240, 18], ["feather", 360, 18], ["conch", 176, 17], ["conch", 374, 17], ["starprize", 220, 16]],
      baddies: [["crabj", 18, 21], ["jelly", 14, 23], ["crab", 24, 22], ["crabj", 27, 22], ["star", 24, 19], ["crab", 43, 23], ["crabj", 46, 23], ["star", 43, 20], ["jelly", 41, 25], ["eel", 46, 25], ["crab", 55, 23], ["crabj", 58, 23], ["crab", 81, 23], ["jelly", 78, 25], ["eel", 85, 25], ["crab", 93, 23], ["crab", 102, 23], ["crabj", 105, 23], ["crab", 112, 23], ["crabj", 115, 23], ["star", 112, 20], ["jelly", 110, 25], ["crab", 124, 23], ["star", 124, 20], ["crab", 135, 23], ["crabj", 149, 23], ["jelly", 144, 25], ["crab", 156, 22], ["crabj", 159, 22], ["star", 156, 19], ["crabj", 168, 22], ["crab", 177, 21], ["jelly", 174, 23], ["eel", 180, 23], ["crab", 190, 20], ["crab", 201, 21], ["crabj", 215, 22], ["eel", 216, 24], ["crab", 224, 22], ["crab", 233, 21], ["star", 233, 18], ["crabj", 246, 22], ["jelly", 242, 24], ["eel", 244, 24], ["crab", 253, 23], ["crabj", 256, 23], ["star", 253, 20], ["crab", 279, 22], ["crabj", 282, 22], ["jelly", 276, 24], ["eel", 283, 24], ["crab", 305, 23], ["star", 305, 20], ["crab", 317, 23], ["jelly", 314, 25], ["eel", 320, 25], ["crab", 329, 23], ["crab", 340, 22], ["crabj", 343, 22], ["crab", 353, 21], ["jelly", 350, 23], ["eel", 357, 23], ["crab", 367, 21], ["crabj", 370, 21], ["crab", 391, 20], ["crabj", 394, 20], ["star", 391, 17], ["jelly", 388, 22], ["crabj", 405, 19], ["star", 402, 16], ["crabj", 416, 18]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["EMBER ISLES — warm shallows and sun-struck cliffs."], face: -1 }, { t: "vendor", c: 220, r: 20, name: "Cinder the Isle-Keeper", face: -1, trade: true, lines: ["Otter Tickets for wares, friend."] }],
      chests: [{ c: 132, r: 20, reward: { tix: 50 } }, { c: 316, r: 20, reward: { tix: 50 } }],
    },

    {
      name: "ABYSSAL TRENCH",
      theme: "abyss",
      underwater: true,
      cols: 460,
      spawn: { x: 150, y: 618 },
      goalX: 13710,
      saveX: [3450, 6900, 10350],
      saveY: 21,
      build(g) {
g.water(0, 459, 0);
g.ground(31, 0, 459);
g.ground(22, 2, 15, 24);
g.ground(22, 16, 27, 24);
g.ground(22, 28, 37, 24);
g.cliff(29, 23, 24);
g.ground(23, 38, 49, 25);
g.ground(23, 50, 62, 25);
g.ground(22, 63, 74, 24);
g.ground(22, 75, 87, 24);
g.cliff(76, 23, 24);
g.ground(21, 88, 97, 23);
g.ground(21, 98, 110, 23);
g.ground(20, 111, 120, 22);
g.ground(20, 121, 132, 22);
g.cliff(122, 21, 22);
g.ground(20, 133, 141, 22);
g.ground(20, 142, 152, 22);
g.ground(19, 153, 166, 21);
g.ground(20, 167, 179, 22);
g.cliff(168, 21, 22);
g.ground(19, 180, 189, 21);
g.ground(19, 190, 202, 21);
g.ground(20, 203, 212, 22);
g.ground(19, 213, 223, 21);
g.cliff(214, 20, 21);
g.ground(20, 224, 237, 22);
g.ground(21, 238, 251, 23);
g.ground(20, 252, 265, 22);
g.ground(21, 266, 278, 23);
g.cliff(267, 22, 23);
g.ground(22, 279, 287, 24);
g.ground(21, 288, 297, 23);
g.ground(21, 298, 309, 23);
g.ground(22, 310, 322, 24);
g.cliff(311, 23, 24);
g.ground(21, 323, 335, 23);
g.ground(22, 336, 348, 24);
g.ground(22, 349, 362, 24);
g.ground(22, 363, 375, 24);
g.cliff(364, 23, 24);
g.ground(21, 376, 389, 23);
g.ground(20, 390, 403, 22);
g.ground(19, 404, 413, 21);
g.ground(18, 414, 425, 20);
g.cliff(415, 19, 20);
g.ground(19, 426, 438, 21);
g.ground(18, 439, 448, 20);
g.ground(19, 449, 456, 21);
g.door(138, 2, 24, "blue");
g.door(253, 2, 24, "indigo");
g.door(368, 2, 24, "yellow");
      },
      picks: [["key_blue", 134, 21], ["key_indigo", 249, 21], ["key_yellow", 364, 21], ["ticket", 8, 20], ["ticket", 21, 20], ["ticket", 32, 20], ["ticket", 43, 21], ["ticket", 56, 21], ["ticket", 68, 20], ["ticket", 81, 20], ["ticket", 92, 19], ["ticket", 104, 19], ["ticket", 115, 18], ["ticket", 126, 18], ["ticket", 137, 18], ["ticket", 147, 18], ["ticket", 159, 17], ["ticket", 173, 18], ["ticket", 184, 17], ["ticket", 196, 17], ["ticket", 207, 18], ["ticket", 218, 17], ["ticket", 230, 18], ["ticket", 244, 19], ["ticket", 258, 18], ["ticket", 272, 19], ["ticket", 283, 20], ["ticket", 292, 19], ["ticket", 303, 19], ["ticket", 316, 20], ["ticket", 329, 19], ["ticket", 342, 20], ["ticket", 355, 20], ["ticket", 369, 20], ["ticket", 382, 19], ["ticket", 396, 18], ["ticket", 408, 17], ["ticket", 419, 16], ["ticket", 432, 17], ["ticket", 443, 16], ["ticket", 452, 17], ["ticket", 388, 20], ["ticket", 262, 20], ["ticket", 71, 20], ["ticket", 209, 20], ["ticket", 140, 20], ["ticket", 303, 20], ["ticket", 37, 20], ["ticket", 400, 20], ["ticket", 325, 20], ["ticket", 400, 20], ["ticket", 35, 20], ["ticket", 199, 20], ["ticket", 238, 20], ["ticket", 176, 20], ["feather", 60, 19], ["feather", 200, 19], ["feather", 340, 19], ["conch", 184, 18], ["conch", 391, 18], ["starprize", 230, 17]],
      baddies: [["crab", 21, 21], ["crabj", 24, 21], ["star", 21, 18], ["crabj", 46, 22], ["crabj", 59, 22], ["star", 56, 19], ["star", 68, 18], ["crabj", 84, 21], ["crabj", 95, 20], ["star", 92, 17], ["crab", 104, 20], ["crabj", 118, 19], ["crab", 126, 19], ["crab", 137, 19], ["crab", 147, 19], ["crab", 159, 18], ["star", 159, 15], ["crab", 173, 19], ["crab", 184, 18], ["star", 196, 15], ["crab", 218, 18], ["crabj", 221, 18], ["crab", 230, 19], ["star", 230, 16], ["crab", 244, 20], ["crab", 258, 19], ["crabj", 261, 19], ["star", 272, 17], ["crab", 283, 21], ["crabj", 286, 21], ["crab", 292, 20], ["crabj", 306, 20], ["crab", 316, 21], ["crabj", 332, 20], ["crab", 342, 21], ["crabj", 345, 21], ["crabj", 358, 21], ["star", 355, 18], ["crab", 369, 21], ["crab", 382, 20], ["crabj", 385, 20], ["crab", 408, 18], ["star", 419, 14], ["jelly", 20, 20], ["eel", 28, 22], ["jelly", 46, 20], ["jelly", 72, 20], ["jelly", 98, 20], ["jelly", 124, 20], ["jelly", 150, 20], ["jelly", 176, 20], ["eel", 184, 22], ["jelly", 202, 20], ["eel", 210, 22], ["jelly", 228, 20], ["eel", 236, 22], ["jelly", 254, 20], ["jelly", 280, 20], ["eel", 288, 22], ["jelly", 306, 20], ["eel", 314, 22], ["jelly", 332, 20], ["eel", 340, 22], ["jelly", 358, 20], ["jelly", 384, 20], ["jelly", 410, 20], ["eel", 418, 22], ["jelly", 436, 20]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["ABYSSAL TRENCH — light dies here. Bubbles are your breath."], face: -1 }, { t: "vendor", c: 230, r: 21, name: "Nerida the Trench-Watcher", face: -1, trade: true, lines: ["Otter Tickets for wares, friend."] }],
      chests: [{ c: 138, r: 21, reward: { tix: 50 } }, { c: 331, r: 21, reward: { tix: 50 } }],
    },

    {
      name: "TIDEBORN SHRINE",
      theme: "sky",
      cols: 460,
      spawn: { x: 150, y: 588 },
      goalX: 13710,
      saveX: [3450, 6900, 10350],
      saveY: 20,
      build(g) {
g.ground(31, 0, 459);
g.ground(21, 2, 14, 23);
g.cloud(17, 3, 6);
g.ground(20, 15, 26, 30);
g.water(15, 26, 20);
g.ground(20, 27, 39, 22);
g.ground(20, 40, 49, 22);
g.cloud(16, 41, 44);
g.ground(20, 50, 58, 30);
g.water(50, 58, 20);
g.wind(50, 53, 6, 19, 1500);
g.platform(7, 49, 54);
g.ground(21, 59, 70, 23);
g.ground(22, 71, 82, 24);
g.cloud(18, 72, 75);
g.ground(22, 83, 91, 30);
g.water(83, 91, 22);
g.ground(23, 92, 104, 25);
g.ground(23, 105, 115, 25);
g.cloud(19, 106, 109);
g.wind(105, 108, 6, 22, 1500);
g.platform(7, 104, 109);
g.ground(23, 116, 125, 30);
g.water(116, 125, 23);
g.ground(23, 126, 138, 25);
g.ground(22, 139, 148, 24);
g.cloud(18, 140, 143);
g.ground(22, 149, 157, 30);
g.water(149, 157, 22);
g.ground(23, 158, 171, 25);
g.wind(158, 161, 6, 22, 1500);
g.platform(7, 157, 162);
g.ground(24, 172, 185, 26);
g.cloud(20, 173, 176);
g.ground(23, 186, 199, 30);
g.water(186, 199, 23);
g.ground(22, 200, 208, 24);
g.ground(23, 209, 217, 25);
g.cloud(19, 210, 213);
g.ground(23, 218, 231, 30);
g.water(218, 231, 23);
g.wind(218, 221, 6, 22, 1500);
g.platform(7, 217, 222);
g.ground(23, 232, 241, 25);
g.ground(24, 242, 252, 26);
g.cloud(20, 243, 246);
g.ground(23, 253, 264, 30);
g.water(253, 264, 23);
g.ground(24, 265, 274, 26);
g.ground(24, 275, 285, 26);
g.cloud(20, 276, 279);
g.wind(275, 278, 6, 23, 1500);
g.platform(7, 274, 279);
g.ground(24, 286, 297, 30);
g.water(286, 297, 24);
g.ground(23, 298, 308, 25);
g.ground(24, 309, 319, 26);
g.cloud(20, 310, 313);
g.ground(23, 320, 330, 30);
g.water(320, 330, 23);
g.ground(23, 331, 343, 25);
g.wind(331, 334, 6, 22, 1500);
g.platform(7, 330, 335);
g.ground(22, 344, 352, 24);
g.cloud(18, 345, 348);
g.ground(23, 353, 361, 30);
g.water(353, 361, 23);
g.ground(24, 362, 371, 26);
g.ground(23, 372, 384, 25);
g.cloud(19, 373, 376);
g.ground(24, 385, 398, 30);
g.water(385, 398, 24);
g.wind(385, 388, 6, 23, 1500);
g.platform(7, 384, 389);
g.ground(24, 399, 411, 26);
g.ground(24, 412, 421, 26);
g.cloud(20, 413, 416);
g.ground(24, 422, 435, 30);
g.water(422, 435, 24);
g.ground(24, 436, 449, 26);
g.ground(24, 450, 456, 26);
g.cloud(20, 451, 454);
g.wind(450, 453, 6, 23, 1500);
g.platform(7, 449, 454);
g.door(147, 2, 24, "green");
g.door(285, 2, 24, "orange");
g.door(391, 2, 24, "violet");
g.shade(368, 448, 0, 34);
      },
      picks: [["key_green", 143, 20], ["key_orange", 281, 20], ["key_violet", 387, 20], ["ticket", 8, 19], ["ticket", 20, 18], ["bubble", 17, 21], ["bubble", 24, 22], ["ticket", 20, 22], ["ticket", 33, 18], ["ticket", 44, 18], ["ticket", 54, 18], ["bubble", 52, 21], ["bubble", 56, 22], ["ticket", 54, 22], ["ticket", 64, 19], ["ticket", 76, 20], ["ticket", 87, 20], ["bubble", 85, 23], ["bubble", 89, 24], ["ticket", 87, 24], ["ticket", 98, 21], ["ticket", 110, 21], ["ticket", 120, 21], ["bubble", 118, 24], ["bubble", 123, 25], ["ticket", 120, 25], ["ticket", 132, 21], ["ticket", 143, 20], ["ticket", 153, 20], ["bubble", 151, 23], ["bubble", 155, 24], ["ticket", 153, 24], ["ticket", 164, 21], ["ticket", 178, 22], ["ticket", 192, 21], ["bubble", 188, 24], ["bubble", 197, 25], ["ticket", 192, 25], ["ticket", 204, 20], ["ticket", 213, 21], ["ticket", 224, 21], ["bubble", 220, 24], ["bubble", 229, 25], ["ticket", 224, 25], ["ticket", 236, 21], ["ticket", 247, 22], ["ticket", 258, 21], ["bubble", 255, 24], ["bubble", 262, 25], ["ticket", 258, 25], ["ticket", 269, 22], ["ticket", 280, 22], ["ticket", 291, 22], ["bubble", 288, 25], ["bubble", 295, 26], ["ticket", 291, 26], ["ticket", 303, 21], ["ticket", 314, 22], ["ticket", 325, 21], ["bubble", 322, 24], ["bubble", 328, 25], ["ticket", 325, 25], ["ticket", 337, 21], ["ticket", 348, 20], ["ticket", 357, 21], ["bubble", 355, 24], ["bubble", 359, 25], ["ticket", 357, 25], ["ticket", 366, 22], ["ticket", 378, 21], ["ticket", 391, 22], ["bubble", 387, 25], ["bubble", 396, 26], ["ticket", 391, 26], ["ticket", 405, 22], ["ticket", 416, 22], ["ticket", 428, 22], ["bubble", 424, 25], ["bubble", 433, 26], ["ticket", 428, 26], ["ticket", 442, 22], ["ticket", 453, 22], ["ticket", 74, 19], ["ticket", 42, 19], ["ticket", 330, 19], ["ticket", 319, 19], ["ticket", 231, 19], ["ticket", 419, 19], ["ticket", 331, 19], ["ticket", 117, 19], ["ticket", 200, 19], ["ticket", 250, 19], ["feather", 40, 18], ["feather", 180, 18], ["feather", 320, 18], ["conch", 184, 17], ["conch", 391, 17], ["starprize", 230, 16]],
      baddies: [["crab", 20, 19], ["jelly", 18, 21], ["eel", 23, 21], ["star", 44, 16], ["crab", 54, 19], ["crabj", 57, 19], ["jelly", 53, 21], ["crab", 64, 20], ["star", 64, 17], ["crab", 76, 21], ["crab", 87, 21], ["jelly", 86, 23], ["eel", 88, 23], ["star", 98, 19], ["crabj", 123, 22], ["jelly", 119, 24], ["crabj", 146, 21], ["star", 143, 18], ["crab", 153, 21], ["jelly", 152, 23], ["eel", 154, 23], ["crab", 164, 22], ["crabj", 181, 23], ["crabj", 195, 22], ["jelly", 189, 24], ["eel", 196, 24], ["crabj", 216, 22], ["star", 224, 19], ["jelly", 221, 24], ["crab", 236, 22], ["crabj", 250, 23], ["jelly", 256, 24], ["eel", 261, 24], ["crabj", 272, 23], ["crab", 280, 23], ["crab", 291, 23], ["crabj", 294, 23], ["jelly", 289, 25], ["star", 303, 19], ["crab", 314, 23], ["crabj", 317, 23], ["star", 314, 20], ["jelly", 323, 24], ["eel", 327, 24], ["crabj", 340, 22], ["star", 337, 19], ["crabj", 351, 21], ["star", 357, 19], ["jelly", 356, 24], ["eel", 358, 24], ["crab", 366, 23], ["crab", 378, 22], ["crabj", 394, 23], ["jelly", 388, 25], ["crab", 405, 23], ["crab", 428, 23], ["star", 428, 20]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["TIDEBORN SHRINE — the old gods keep their gates locked."], face: -1 }, { t: "vendor", c: 230, r: 20, name: "Ione the Shrine-Singer", face: -1, trade: true, lines: ["Otter Tickets for wares, friend."] }],
      chests: [{ c: 138, r: 20, reward: { tix: 50 } }, { c: 331, r: 20, reward: { tix: 50 } }],
    },

    {
      name: "MIRROR LAGOON",
      theme: "shore",
      cols: 460,
      spawn: { x: 150, y: 558 },
      goalX: 13710,
      goalY: 13,
      saveX: [3450, 6900, 10350],
      saveY: 19,
      build(g) {
g.ground(31, 0, 1);
        g.ground(20, 2, 13, 22);
        g.ground(31, 2, 13);
        g.ground(19, 14, 27);
        g.ground(19, 28, 47, 21);
        g.ground(31, 28, 47);
        g.ground(19, 48, 57);
        g.ground(18, 58, 70, 20);
        g.ground(31, 58, 70);
        g.ground(19, 71, 84, 21);
        g.ground(31, 71, 84);
        g.ground(18, 85, 98);
        g.ground(18, 99, 123, 20);
        g.ground(31, 99, 123);
        g.ground(19, 124, 134);
        g.ground(18, 135, 137, 20);
        g.ground(31, 135, 137);
        g.ground(31, 138, 138);
        g.ground(18, 139, 147, 20);
        g.ground(31, 139, 147);
        g.ground(17, 148, 158, 19);
        g.ground(31, 148, 158);
        g.ground(18, 159, 172);
        g.ground(17, 173, 194, 19);
        g.ground(31, 173, 194);
        g.ground(18, 195, 208);
        g.ground(19, 209, 226, 21);
        g.ground(31, 209, 226);
        g.ground(18, 227, 236);
        g.ground(18, 237, 248, 20);
        g.ground(31, 237, 248);
        g.ground(19, 249, 257, 21);
        g.ground(31, 249, 257);
        g.ground(19, 258, 267);
        g.ground(19, 268, 275, 21);
        g.ground(31, 268, 275);
        g.ground(31, 276, 276);
        g.ground(19, 277, 277, 21);
        g.ground(31, 277, 277);
        g.ground(20, 278, 286, 22);
        g.ground(31, 278, 286);
        g.ground(21, 287, 296);
        g.ground(22, 297, 305, 24);
        g.ground(31, 297, 305);
        g.ground(23, 306, 315, 25);
        g.ground(31, 306, 315);
        g.ground(23, 316, 329);
        g.ground(23, 330, 352, 25);
        g.ground(31, 330, 352);
        g.ground(22, 353, 366);
        g.ground(21, 367, 390, 23);
        g.ground(31, 367, 390);
        g.ground(22, 391, 403);
        g.ground(21, 404, 413, 23);
        g.ground(31, 404, 413);
        g.ground(22, 414, 425, 24);
        g.ground(31, 414, 425);
        g.ground(23, 426, 437);
        g.ground(22, 438, 450, 24);
        g.ground(31, 438, 450);
        g.ground(23, 451, 456, 25);
        g.ground(31, 451, 456);
        g.ground(31, 457, 459);
        g.door(138, 2, 24, "red");
        g.door(276, 2, 24, "blue");
        g.cloud(13, 149, 152);
        g.cloud(13, 185, 188);
        g.cloud(14, 113, 116);
        g.cloud(15, 39, 42);
        g.cloud(15, 72, 75);
        g.cloud(15, 219, 222);
        g.cloud(15, 250, 253);
        g.cloud(16, 3, 6);
        g.cloud(16, 279, 282);
        g.cloud(17, 381, 384);
        g.cloud(18, 415, 418);
        g.cloud(19, 307, 310);
        g.cloud(19, 344, 347);
        g.cloud(19, 452, 455);
        g.water(14, 27, 19);
        g.water(48, 57, 19);
        g.water(85, 98, 18);
        g.water(124, 134, 19);
        g.water(159, 172, 18);
        g.water(195, 208, 18);
        g.water(227, 236, 18);
        g.water(258, 267, 19);
        g.water(287, 296, 21);
        g.water(316, 329, 23);
        g.water(353, 366, 22);
        g.water(391, 403, 22);
        g.water(426, 437, 23);
      },
      picks: [["key_red", 41, 14], ["key_blue", 237, 16], ["ticket", 7, 18], ["ticket", 20, 17], ["bubble", 16, 20], ["bubble", 25, 21], ["ticket", 20, 21], ["ticket", 32, 17], ["ticket", 42, 17], ["ticket", 52, 17], ["bubble", 50, 20], ["bubble", 55, 21], ["ticket", 52, 21], ["ticket", 64, 16], ["ticket", 77, 17], ["ticket", 91, 16], ["bubble", 87, 19], ["bubble", 96, 20], ["ticket", 91, 20], ["ticket", 105, 16], ["ticket", 117, 16], ["ticket", 129, 17], ["bubble", 126, 20], ["bubble", 132, 21], ["ticket", 129, 21], ["ticket", 141, 16], ["ticket", 153, 15], ["ticket", 165, 16], ["bubble", 161, 19], ["bubble", 170, 20], ["ticket", 165, 20], ["ticket", 178, 15], ["ticket", 189, 15], ["ticket", 201, 16], ["bubble", 197, 19], ["bubble", 206, 20], ["ticket", 201, 20], ["ticket", 213, 17], ["ticket", 222, 17], ["ticket", 231, 16], ["bubble", 229, 19], ["bubble", 234, 20], ["ticket", 231, 20], ["ticket", 242, 16], ["ticket", 253, 17], ["ticket", 262, 17], ["bubble", 260, 20], ["bubble", 265, 21], ["ticket", 262, 21], ["ticket", 272, 17], ["ticket", 282, 18], ["ticket", 291, 19], ["bubble", 289, 22], ["bubble", 294, 23], ["ticket", 291, 23], ["ticket", 301, 20], ["ticket", 310, 21], ["ticket", 322, 21], ["bubble", 318, 24], ["bubble", 327, 25], ["ticket", 322, 25], ["ticket", 336, 21], ["ticket", 347, 21], ["ticket", 359, 20], ["bubble", 355, 23], ["bubble", 364, 24], ["ticket", 359, 24], ["ticket", 373, 19], ["ticket", 385, 19], ["ticket", 397, 20], ["bubble", 393, 23], ["bubble", 401, 24], ["ticket", 397, 24], ["ticket", 408, 19], ["ticket", 419, 20], ["ticket", 431, 21], ["bubble", 428, 24], ["bubble", 435, 25], ["ticket", 431, 25], ["ticket", 444, 20], ["ticket", 453, 21], ["ticket", 88, 18], ["ticket", 376, 18], ["ticket", 196, 18], ["ticket", 57, 18], ["ticket", 333, 18], ["ticket", 53, 18], ["ticket", 279, 18], ["ticket", 370, 18], ["ticket", 144, 18], ["ticket", 109, 18], ["ticket", 206, 18], ["feather", 55, 17], ["feather", 220, 17], ["feather", 380, 17], ["conch", 184, 16], ["conch", 391, 16], ["starprize", 230, 15]],
      baddies: [["crab", 20, 18], ["crabj", 23, 18], ["jelly", 17, 20], ["eel", 24, 20], ["crab", 32, 18], ["crab", 42, 18], ["crabj", 45, 18], ["jelly", 51, 20], ["eel", 54, 20], ["crabj", 67, 17], ["crab", 77, 18], ["star", 77, 15], ["crabj", 94, 17], ["star", 91, 14], ["jelly", 88, 19], ["eel", 95, 19], ["crabj", 108, 17], ["star", 105, 14], ["crab", 117, 17], ["crab", 129, 18], ["star", 129, 15], ["jelly", 127, 20], ["crab", 141, 17], ["crab", 153, 16], ["crabj", 156, 16], ["star", 153, 13], ["jelly", 162, 19], ["crab", 178, 16], ["star", 178, 13], ["crab", 189, 16], ["crabj", 192, 16], ["crab", 201, 17], ["star", 201, 14], ["jelly", 198, 19], ["eel", 205, 19], ["crab", 213, 18], ["crabj", 216, 18], ["star", 213, 15], ["crab", 222, 18], ["crabj", 225, 18], ["star", 231, 14], ["jelly", 230, 19], ["eel", 233, 19], ["crab", 253, 18], ["crab", 262, 18], ["crabj", 265, 18], ["crabj", 275, 18], ["crab", 282, 19], ["crab", 291, 20], ["jelly", 290, 22], ["crabj", 304, 21], ["star", 322, 19], ["jelly", 319, 24], ["eel", 326, 24], ["crab", 347, 22], ["crabj", 362, 21], ["jelly", 356, 23], ["crab", 373, 20], ["crabj", 376, 20], ["star", 397, 18], ["jelly", 394, 23], ["eel", 400, 23], ["crab", 408, 20], ["crabj", 434, 22], ["star", 431, 19]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["MIRROR LAGOON — still waters, patient Otter Tickets."], face: -1 }, { t: "vendor", c: 230, r: 19, name: "Noula the Lagoon-Keeper", lines: ["Otter Tickets for wares, friend."], face: -1, trade: true }],
      chests: [{ c: 138, r: 19, reward: { tix: 50 } }, { c: 331, r: 19, reward: { tix: 50 } }],
    },

    {
      name: "MOLTEN CHASM",
      theme: "lava",
      cols: 480,
      spawn: { x: 150, y: 678 },
      goalX: 14310,
      goalY: 13,
      saveX: [3600, 7200, 10800],
      saveY: 23,
      build(g) {
g.ground(0, 0, 1, 3);
        g.ground(31, 0, 1);
        g.ground(0, 2, 15, 3);
        g.ground(24, 2, 15, 26);
        g.ground(31, 2, 15);
        g.ground(0, 16, 24, 3);
        g.ground(25, 16, 24);
        g.ground(0, 25, 25, 3);
        g.ground(25, 25, 25, 27);
        g.ground(31, 25, 25);
        g.ground(0, 26, 26, 3);
        g.ground(25, 26, 26, 25);
        g.ground(31, 26, 26);
        g.ground(0, 27, 38, 3);
        g.ground(25, 27, 38, 27);
        g.ground(31, 27, 38);
        g.ground(0, 39, 49, 3);
        g.ground(26, 39, 49, 28);
        g.ground(31, 39, 49);
        g.ground(0, 50, 59, 3);
        g.ground(26, 50, 59);
        g.ground(0, 60, 72, 3);
        g.ground(26, 60, 72, 28);
        g.ground(31, 60, 72);
        g.ground(0, 73, 73, 3);
        g.ground(25, 73, 73, 27);
        g.ground(31, 73, 73);
        g.ground(0, 74, 74, 3);
        g.ground(25, 74, 74, 25);
        g.ground(31, 74, 74);
        g.ground(0, 75, 84, 3);
        g.ground(25, 75, 84, 27);
        g.ground(31, 75, 84);
        g.ground(0, 85, 93, 3);
        g.ground(26, 85, 93);
        g.ground(0, 94, 106, 3);
        g.ground(26, 94, 106, 28);
        g.ground(31, 94, 106);
        g.ground(0, 107, 120, 3);
        g.ground(25, 107, 120, 27);
        g.ground(31, 107, 120);
        g.ground(0, 121, 121, 3);
        g.ground(26, 121, 121);
        g.ground(0, 122, 122, 3);
        g.ground(26, 122, 122, 26);
        g.ground(29, 122, 122);
        g.ground(0, 123, 133, 3);
        g.ground(26, 123, 133);
        g.ground(0, 134, 143, 3);
        g.ground(25, 134, 143, 27);
        g.ground(31, 134, 143);
        g.ground(0, 144, 144, 1);
        g.ground(25, 144, 144, 27);
        g.ground(31, 144, 144);
        g.ground(0, 145, 145, 3);
        g.ground(25, 145, 145, 27);
        g.ground(31, 145, 145);
        g.ground(0, 146, 156, 3);
        g.ground(24, 146, 156, 26);
        g.ground(31, 146, 156);
        g.ground(0, 157, 169, 3);
        g.ground(23, 157, 169);
        g.ground(0, 170, 170, 3);
        g.ground(23, 170, 170, 25);
        g.ground(31, 170, 170);
        g.ground(0, 171, 171, 3);
        g.ground(23, 171, 171, 23);
        g.ground(31, 171, 171);
        g.ground(0, 172, 181, 3);
        g.ground(23, 172, 181, 25);
        g.ground(31, 172, 181);
        g.ground(0, 182, 191, 3);
        g.ground(24, 182, 191, 26);
        g.ground(31, 182, 191);
        g.ground(0, 192, 203, 3);
        g.ground(24, 192, 203);
        g.ground(0, 204, 215, 3);
        g.ground(24, 204, 215, 26);
        g.ground(31, 204, 215);
        g.ground(0, 216, 216, 3);
        g.ground(24, 216, 216, 24);
        g.ground(31, 216, 216);
        g.ground(0, 217, 224, 3);
        g.ground(24, 217, 224, 26);
        g.ground(31, 217, 224);
        g.ground(0, 225, 235, 3);
        g.ground(23, 225, 235);
        g.ground(0, 236, 257, 3);
        g.ground(23, 236, 257, 25);
        g.ground(31, 236, 257);
        g.ground(0, 258, 258, 3);
        g.ground(24, 258, 258);
        g.ground(0, 259, 259, 3);
        g.ground(24, 259, 259, 24);
        g.ground(27, 259, 259);
        g.ground(0, 260, 270, 3);
        g.ground(24, 260, 270);
        g.ground(0, 271, 277, 3);
        g.ground(23, 271, 277, 25);
        g.ground(31, 271, 277);
        g.ground(0, 278, 278, 1);
        g.ground(25, 278, 278, 25);
        g.ground(31, 278, 278);
        g.ground(0, 279, 284, 3);
        g.ground(23, 279, 284, 25);
        g.ground(31, 279, 284);
        g.ground(0, 285, 298, 3);
        g.ground(22, 285, 298, 24);
        g.ground(31, 285, 298);
        g.ground(0, 299, 308, 3);
        g.ground(21, 299, 308);
        g.ground(0, 309, 309, 3);
        g.ground(22, 309, 309, 24);
        g.ground(31, 309, 309);
        g.ground(0, 310, 310, 3);
        g.ground(22, 310, 310, 22);
        g.ground(31, 310, 310);
        g.ground(0, 311, 322, 3);
        g.ground(22, 311, 322, 24);
        g.ground(31, 311, 322);
        g.ground(0, 323, 334, 3);
        g.ground(23, 323, 334, 25);
        g.ground(31, 323, 334);
        g.ground(0, 335, 344, 3);
        g.ground(24, 335, 344);
        g.ground(0, 345, 357, 3);
        g.ground(25, 345, 357, 27);
        g.ground(31, 345, 357);
        g.ground(0, 358, 358, 3);
        g.ground(24, 358, 358, 26);
        g.ground(31, 358, 358);
        g.ground(0, 359, 359, 3);
        g.ground(24, 359, 359, 24);
        g.ground(31, 359, 359);
        g.ground(0, 360, 366, 3);
        g.ground(24, 360, 366, 26);
        g.ground(31, 360, 366);
        g.ground(0, 367, 380, 3);
        g.ground(24, 367, 380);
        g.ground(0, 381, 392, 3);
        g.ground(25, 381, 392, 27);
        g.ground(31, 381, 392);
        g.ground(0, 393, 393, 1);
        g.ground(25, 393, 393, 26);
        g.ground(31, 393, 393);
        g.ground(0, 394, 405, 3);
        g.ground(24, 394, 405, 26);
        g.ground(31, 394, 405);
        g.ground(0, 406, 406, 3);
        g.ground(23, 406, 406);
        g.ground(0, 407, 407, 3);
        g.ground(23, 407, 407, 23);
        g.ground(26, 407, 407);
        g.ground(0, 408, 419, 3);
        g.ground(23, 408, 419);
        g.ground(0, 420, 432, 3);
        g.ground(24, 420, 432, 26);
        g.ground(31, 420, 432);
        g.ground(0, 433, 441, 3);
        g.ground(23, 433, 441, 25);
        g.ground(31, 433, 441);
        g.ground(0, 442, 450, 3);
        g.ground(22, 442, 450);
        g.ground(0, 451, 451, 3);
        g.ground(22, 451, 451, 24);
        g.ground(31, 451, 451);
        g.ground(0, 452, 452, 3);
        g.ground(22, 452, 452, 22);
        g.ground(31, 452, 452);
        g.ground(0, 453, 461, 3);
        g.ground(22, 453, 461, 24);
        g.ground(31, 453, 461);
        g.ground(0, 462, 472, 3);
        g.ground(21, 462, 472, 23);
        g.ground(31, 462, 472);
        g.ground(0, 473, 476, 3);
        g.ground(21, 473, 476);
        g.ground(0, 477, 479, 3);
        g.ground(31, 477, 479);
        g.cliff(26, 26, 27);
        g.cliff(74, 26, 27);
        g.cliff(122, 27, 28);
        g.cliff(171, 24, 25);
        g.cliff(216, 25, 26);
        g.cliff(259, 25, 26);
        g.cliff(310, 23, 24);
        g.cliff(359, 25, 26);
        g.cliff(407, 24, 25);
        g.cliff(452, 23, 24);
        g.door(144, 2, 24, "orange");
        g.door(278, 2, 24, "red");
        g.door(393, 2, 24, "yellow");
        g.water(16, 24, 25);
        g.water(50, 59, 26);
        g.water(85, 93, 26);
        g.water(121, 133, 26);
        g.water(157, 169, 23);
        g.water(192, 203, 24);
        g.water(225, 235, 23);
        g.water(258, 270, 24);
        g.water(299, 308, 21);
        g.water(335, 344, 24);
        g.water(367, 380, 24);
        g.water(406, 419, 23);
        g.water(442, 450, 22);
        g.water(473, 476, 21);
      },
      picks: [["key_orange", 60, 24], ["key_red", 183, 22], ["key_yellow", 309, 20], ["ticket", 8, 22], ["ticket", 20, 23], ["bubble", 18, 26], ["bubble", 22, 27], ["ticket", 20, 27], ["ticket", 31, 23], ["ticket", 44, 24], ["ticket", 54, 24], ["bubble", 52, 27], ["bubble", 57, 28], ["ticket", 54, 28], ["ticket", 66, 24], ["ticket", 78, 23], ["ticket", 89, 24], ["bubble", 87, 27], ["bubble", 91, 28], ["ticket", 89, 28], ["ticket", 100, 24], ["ticket", 113, 23], ["ticket", 127, 24], ["bubble", 123, 27], ["bubble", 131, 28], ["ticket", 127, 28], ["ticket", 139, 23], ["ticket", 151, 22], ["ticket", 163, 21], ["bubble", 159, 24], ["bubble", 167, 25], ["ticket", 163, 25], ["ticket", 175, 21], ["ticket", 186, 22], ["ticket", 197, 22], ["bubble", 194, 25], ["bubble", 201, 26], ["ticket", 197, 26], ["ticket", 209, 22], ["ticket", 219, 22], ["ticket", 230, 21], ["bubble", 227, 24], ["bubble", 233, 25], ["ticket", 230, 25], ["ticket", 240, 21], ["ticket", 251, 21], ["ticket", 264, 22], ["bubble", 260, 25], ["bubble", 268, 26], ["ticket", 264, 26], ["ticket", 277, 21], ["ticket", 291, 20], ["ticket", 303, 19], ["bubble", 301, 22], ["bubble", 306, 23], ["ticket", 303, 23], ["ticket", 315, 20], ["ticket", 328, 21], ["ticket", 339, 22], ["bubble", 337, 25], ["bubble", 342, 26], ["ticket", 339, 26], ["ticket", 351, 23], ["ticket", 362, 22], ["ticket", 373, 22], ["bubble", 369, 25], ["bubble", 378, 26], ["ticket", 373, 26], ["ticket", 386, 23], ["ticket", 399, 22], ["ticket", 412, 21], ["bubble", 408, 24], ["bubble", 417, 25], ["ticket", 412, 25], ["ticket", 426, 22], ["ticket", 437, 21], ["ticket", 446, 20], ["bubble", 444, 23], ["bubble", 448, 24], ["ticket", 446, 24], ["ticket", 456, 20], ["ticket", 467, 19], ["ticket", 474, 19], ["bubble", 475, 22], ["bubble", 474, 23], ["ticket", 474, 23], ["ticket", 67, 22], ["ticket", 227, 22], ["ticket", 130, 22], ["ticket", 195, 22], ["ticket", 37, 22], ["ticket", 292, 22], ["ticket", 257, 22], ["ticket", 318, 22], ["ticket", 328, 22], ["ticket", 41, 22], ["feather", 70, 21], ["feather", 210, 21], ["feather", 360, 21], ["conch", 192, 20], ["conch", 408, 20], ["starprize", 240, 19]],
      baddies: [["crabj", 23, 24], ["jelly", 19, 26], ["eel", 21, 26], ["crab", 31, 24], ["star", 31, 21], ["crabj", 47, 25], ["star", 66, 22], ["crabj", 81, 24], ["star", 78, 21], ["crab", 89, 25], ["star", 89, 22], ["jelly", 88, 27], ["eel", 90, 27], ["star", 100, 22], ["crab", 127, 25], ["eel", 130, 27], ["crabj", 142, 24], ["crab", 151, 23], ["star", 151, 20], ["star", 163, 19], ["jelly", 160, 24], ["eel", 166, 24], ["crab", 175, 22], ["star", 175, 19], ["crabj", 189, 23], ["crab", 197, 23], ["crabj", 200, 23], ["jelly", 195, 25], ["eel", 200, 25], ["crabj", 222, 23], ["star", 219, 20], ["crab", 230, 22], ["crabj", 233, 22], ["eel", 232, 24], ["crab", 240, 22], ["crab", 264, 23], ["star", 264, 20], ["jelly", 261, 25], ["crab", 291, 21], ["star", 303, 17], ["jelly", 302, 22], ["crab", 315, 21], ["crabj", 331, 22], ["star", 328, 19], ["star", 339, 20], ["jelly", 338, 25], ["crab", 362, 23], ["crab", 373, 23], ["star", 373, 20], ["jelly", 370, 25], ["crabj", 389, 24], ["star", 386, 21], ["crab", 399, 23], ["crabj", 402, 23], ["star", 399, 20], ["crab", 412, 22], ["jelly", 409, 24], ["eel", 416, 24], ["crabj", 429, 23], ["star", 426, 20], ["crab", 446, 21], ["crabj", 449, 21], ["jelly", 445, 23]],
      npcs: [{ t: "sign", c: 6, r: 30, name: "Signpost", lines: ["MOLTEN CHASM — the earth bleeds fire down here."], face: -1 }, { t: "vendor", c: 240, r: 23, name: "Brim the Forge-Guard", lines: ["Otter Tickets for wares, friend."], face: -1, trade: true }],
      chests: [{ c: 144, r: 23, reward: { tix: 50 } }, { c: 345, r: 23, reward: { tix: 50 } }],
    }
  ];

  window.WAVEBOUND_LEVELS = levels;
})();
