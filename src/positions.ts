// 经典中局和残局位置库
export const CHESS_POSITIONS = {
  // 中局位置
  middlegame: [
    {
      name: "西西里防御 - 龙式变例",
      fen: "r1bqkb1r/pp3ppp/2n1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R2QKB1R w KQkq - 0 8"
    },
    {
      name: "后翼弃兵",
      fen: "rnbq1rk1/pp3ppp/2p1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R1BQKB1R w KQ - 3 8"
    },
    {
      name: "西班牙开局",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
    },
    {
      name: "意大利开局",
      fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
    },
    {
      name: "苏格兰开局",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 2 3"
    }
  ],
  
  // 残局位置
  endgame: [
    {
      name: "兵残局 - 关键格",
      fen: "8/8/8/8/8/5k2/4P3/4K3 w - - 0 1"
    },
    {
      name: "车兵残局",
      fen: "8/8/8/8/8/5k2/4P1R1/4K3 w - - 0 1"
    },
    {
      name: "后兵残局",
      fen: "8/8/8/8/8/5k2/4PQ2/4K3 w - - 0 1"
    },
    {
      name: "象兵残局",
      fen: "8/8/8/8/8/5k2/4PB2/4K3 w - - 0 1"
    },
    {
      name: "马兵残局",
      fen: "8/8/8/8/8/5k2/4PN2/4K3 w - - 0 1"
    },
    {
      name: "车对车残局",
      fen: "8/8/8/8/8/5k2/4R1K1/4r3 w - - 0 1"
    },
    {
      name: "后对后残局",
      fen: "8/8/8/8/8/5k2/4QK2/4q3 w - - 0 1"
    },
    {
      name: "双象对马",
      fen: "8/8/8/8/8/5k2/4BBN1/4K3 w - - 0 1"
    }
  ],

  // 战术位置
  tactical: [
    {
      name: "希腊礼物牺牲",
      fen: "r1bq1rk1/pp3ppp/2n1pn2/2bpp3/2B1P3/2N2N2/PPQ2PPP/R1B2RK1 w - - 0 10"
    },
    {
      name: "后翼弃兵战术",
      fen: "r1bqk2r/pp3ppp/2n1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R2QKB1R w KQkq - 0 8"
    },
    {
      name: "意大利开局战术",
      fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
    }
  ],

  // 获取随机位置
  getRandomPosition(type: 'middlegame' | 'endgame' | 'tactical' | 'all' = 'all') {
    let positions: any[] = [];
    
    if (type === 'all') {
      positions = [...this.middlegame, ...this.endgame, ...this.tactical];
    } else {
      positions = this[type];
    }
    
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  },

  // 获取所有位置名称列表
  getPositionNames(type: 'middlegame' | 'endgame' | 'tactical' | 'all' = 'all') {
    if (type === 'all') {
      return [
        ...this.middlegame.map(p => p.name),
        ...this.endgame.map(p => p.name),
        ...this.tactical.map(p => p.name)
      ];
    }
    return this[type].map(p => p.name);
  }
};
