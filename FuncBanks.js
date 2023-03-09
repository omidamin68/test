const Test0 = (X,IMP,CB) => {
    try{

        // const DO = () => {
        //     try {
        //         //Test1
        //         let options=IMP.P.BlocksRuned[X.id].options
        //         options.RunCount++
        //         options.LastRunTime = Date.now()
        //         if (options.status) {
        //             setTimeout(() => {
        //                 DO()
        //             }, 1000)
        //         }
        //     }catch (e) {
        //         console.log('Errrror1')
        //     }
        // }
        //
        // DO()
        console.log('D1')
    }catch(e){
        console.log('Errrror3')

    }
}

const NOB_CO_Axios = (x) => {

    let NOB = x.IMP.P.NOB
    let IND = x.IMP.Func.IND
    let axios = x.IMP.axios
    let doEncrypt = x.IMP.Func.doEncrypt
    let doDecrypt = x.IMP.Func.doDecrypt
    let momentM = x.IMP.momentM
    let data = x.data
    let timeout = x.timeout || 30000

    let route = NOB.nobCallUrl
    let url
    let mainUrl

    if (NOB.orderback == '1') {
        const urls = [];
        NOB.serverIpList.forEach((s) => {
            if (s.status === 'ok') {
                urls.push(s.AD)
            }
        })
        const random = Math.floor(Math.random() * urls.length);
        url = urls[random] + route
        mainUrl = urls[random]
    } else {
        url = NOB.orderback + route
        mainUrl = NOB.orderback
    }
    data.timeReq = momentM().valueOf()
    if (NOB.consolShow) {
        // console.log('data',data);
    }
    let options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {data: doEncrypt(JSON.stringify(data), x.IMP.P.roro)},
        timeout: timeout,
        url: url,
    };

    axios(options)
        .then(response => {
                if (NOB.encryptRes) {
                    response.data = JSON.parse(doDecrypt(response.data, x.IMP.P.roro))
                }
                try {
                    NOB.serverIpList.find(s => s.AD === mainUrl).success++
                } catch (e) {
                }

                c.cb(true, response)
            }
        )
        .catch(error => {
            try {
                NOB.serverIpList.find(s => s.AD === mainUrl).error++
            } catch (e) {
            }
            try {
                console.log(IND(error), 'Error-----');
            } catch (e) {
            }
            try {
                console.log(IND(error.response), 'Error-----');
            } catch (e) {
            }
            try {
                let R = error

                R = JSON.parse(doDecrypt(error, x.IMP.P.roro))

                console.log(IND(error), 'Error-----');
                console.log(R, 'Error-----');
            } catch (e) {
            }
            x.cb(false, e)
        })

}

export const Test1 = (X, IMP, CB = () => {}) => {
    let P = IMP.P
    try {
        let Start = () => {
            try {
                P.SS.test++
                let Options = P.BlocksRuned[X.id].options
                Options.RunCount++
                Options.LastRunTime = Date.now()

                // let D={
                //     SmallFuncName:'SmallF_Test1',
                //     X:{
                //         TestNumber:IND(P.SS.test)
                //     }
                // }
                // IMP.Func.RunSmF(D,(S,R)=>{
                //     console.log('RunSmF',S,R);
                // })

                // [SmallF_Test1].toString()(X.IMP,(S,R)=>{
                //     console.log('SmallF_Test1',S,R);
                // })

                // eval(`(${F.content})(X, IMP, (...e) => {
                //     cb(...e)
                // })`)

                setTimeout(() => {
                    Start()
                }, 1000)
            } catch (e) {
                // P.BlocksRuned[X.id].options.ErrorCount++
                let Options = P.BlocksRuned[X.id].options
                Options.ErrorCount++;

                ///22218
            }
        }

        Start()

    } catch (e) {
        try {
            let Options = P.BlocksRuned[X.id].options
            Options.ErrorCount++
        } catch (e) {}
    }

}


////////////////////////////
// NOB FUNCTIONS
////////////////////////////


export const NOB_CO_FILL_OPTIONS = (X,IMP,CB) => {

    try {

        let P=IMP.P
        let NOB_CO=P.NOB.CO
        let Options=P.BlocksRuned[X.id].options
        let axios = IMP.axios

        const  CP=(p)=>{
            try {
                if(p==='1'){
                    return  0
                }else {
                    return p.split('.')[1].length
                }
            }catch (e) {
                return null
                console.log(1,e);
            }

        }

        let AxiosOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
            url: 'https://api.nobitex.ir/v2/options',
        };

        axios(AxiosOptions)
            .then(response => {

                try {
                    if(response.data.status==='ok'){

                        NOB_CO.NOB_OPTION=response.data
                        response.data.coins.forEach(e=>{
                            let PD=null
                            let CD=null
                            let AC=false

                            // if(e.coin!=='rls' &&e.coin!=='pmn' && e.coin!=='usdt'  ){

                                try {
                                    PD=CP(response.data.nobitex.pricePrecisions[`${e.coin.toUpperCase()}USDT`])
                                }catch (e) {}

                                try {
                                    CD=CP(response.data.nobitex.amountPrecisions[`${e.coin.toUpperCase()}USDT`])
                                }catch (e) {

                                }
                                try {
                                    if( ( response.data.nobitex.activeCurrencies.find(ee=>ee===e.coin)) !==undefined ){AC=true}
                                }catch (e) {

                                }
                            // }

                            NOB_CO.Infos[e.coin]={
                                "OName": e.name,
                                "Name":e.coin,
                                "Price_Desimal": PD,
                                "CR_Desimal": CD,
                                "status": true,
                                "active": AC,
                                "cycleTypes": 3,
                                "CR_Setting":{sellV:0,buyV:0,sellStatus:"none",buyStatus:"none",status:'none',orderID:"",perDonr:0},
                                wallet:{
                                    rialBalanceSell:0,
                                    rialBalance:0,
                                }
                            }


                        })

                        Options.RunCount++
                        Options.LastRunTime=Date.now()

                        CB(true)
                    }
                    else {
                        Options.ErrorCount++
                        CB(false)
                    }
                }catch (e) {
                    console.log(2,e);
                }

            })
            .catch(error => {
                Options.ErrorCount++
                CB(false)
                console.log(3,error);
            })

    }catch (e) {
        try {IMP.P.BlocksRuned[X.id].options.ErrorCount++}catch (e) {}
        CB(false)
        console.log(4,e);
    }

}

export const NOB_CO_CallStats=(X,IMP,CB) => {
    let randomString=IMP.randomString
    const Error=(E)=>{
        try {IMP.P.BlocksRuned[X.id].options.ErrorCount++}catch (e) {}
        try {IMP.P.ErrorLogs[`NOB_CO_CallStats_${Date.now()}_${randomString({length: 5})}`]=E}catch (e) {}
    }

    try {
        let NOB=IMP.P.NOB.CO

        NOB.stats = {
            "thenC": 0,
            "catchC": 0,
            "CrListR": {},
        }

        let callStats=()=>{
            try {
                let Options=IMP.P.BlocksRuned[X.id].options

                let reqTime=Date.now()
                let options  ={
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: 'https://api.nobitex.ir/v2/orderbook/all',
                    timeout: 4000
                }
                NOB.stats.reqTime=reqTime
                IMP.axios(options)
                    .then(async (response) => {
                        NOB.stats.CrListR=response.data
                        NOB.stats.Time=Date.now()
                        NOB.stats.thenC++
                        Options.RunCount++
                        Options.LastRunTime=Date.now()
                    })
                    .catch(error => {
                        Options.ErrorCount++
                        NOB.stats.catchC++
                        IMP.P.ErrorLogs[`NOB_CO_CallStats_${Date.now()}_${randomString({length: 5})}`]=error
                    }) .finally(() => {
                    setTimeout(()=>{
                        if(Options.status){
                            callStats()
                        }
                    },NOB.callStatsTime)
                })
            }catch (e) {
                Error(e)
            }

        }

        callStats()

        setTimeout(()=>{
            CB(true)
        },1500)

    }
    catch (e) {
        Error(e)
        CB(false)
    }

}

export const NOB_User_CreateNobData=(X,IMP,CB)=>{

    try {
        // let NOB=X.IMP.P.NOB
        let NOB=IMP.P.NOB[X.name]
        let CO=IMP.P.NOB.CO
        let Options=IMP.P.BlocksRuned[X.id].options
        let NobitexData={}
        let CR_Setting={}
        NOB.Infos={}
        Object.entries(IND(CO.Infos)).forEach(([K,V],k)=>{

            if(V.active){
                NOB.Infos[K]=V
                CR_Setting[K]={sellV:0,buyV:0,sellStatus:"none",buyStatus:"none",status:'none',orderID:"",perDonr:0}

                if( (K!=='rls' && K!=='pmn' && K!=='usdt' ) ){
                    let UPC=K.toUpperCase()
                    NobitexData[`IRT_${UPC}_USDT_IRT`]={
                        cancelledCount:0,
                        OK1:false,
                        OK2:false,
                        OK3:false,
                        showDetail:false,
                        base:'IRT',
                        sellEndTime:"",
                        OName:V.OName,
                        Fname:V.Fname,
                        Sname:V.Sname,
                        type:"S",
                        retryCount:0,
                        retryCount1:0,
                        retryCount2:0,
                        retryCount3:0,
                        cycleType:V.cycleTypes,
                        sellingData:{
                            step1:{
                                status:"none",
                            },
                            step2:{
                                status:"none",
                            },
                            step3:{
                                status:"none",
                            },
                        },
                        RunSycle: true,
                        RunSycle1: true,
                        RunSycle2: true,
                        RunSycle3: true,
                        status:V.status,
                        selling:false,
                        percentToGet:0.2,
                        SellBuyData1:{},
                        SellBuyData2:{},
                        SellBuyData3:{},
                        SellBuyData1S:"none",
                        SellBuyData2S:"none",
                        SellBuyData3S:"none",
                        checkStatus:0,
                        testS:0,
                        testE:0,
                        name:`IRT_${UPC}_USDT_IRT`,
                        cycle:[`${UPC}IRT`, `${UPC}USDT`,`USDTIRT`],
                        cycleR:[`USDTIRT`, `${UPC}USDT`,`${UPC}IRT`],
                        XX:UPC,
                        sood:0,
                        PD:V.Price_Desimal,
                        Do_Cycle:[
                            ["rls",K,"buy","XXIRZ",V.CR_Desimal],
                            ["usdt",K,"sell","XXUSZ",V.CR_Desimal],
                            ["rls","usdt","sell","USIRZ",2],
                        ],
                        Do_CycleR:[
                            ["rls","usdt","buy","USIRZ",2],
                            ["usdt",K,"buy","",V.CR_Desimal],
                            ["rls",K,"sell","",V.CR_Desimal],
                        ],

                    }
                    NobitexData[`IRT_USDT_${UPC}_IRT`]={
                        cancelledCount:0,
                        OK1:false,
                        OK2:false,
                        OK3:false,
                        showDetail:false,
                        base:'IRT',
                        sellEndTime:"",
                        OName:V.OName,
                        Fname:V.Fname,
                        Sname:V.Sname,
                        type:"R",
                        retryCount:0,
                        retryCount1:0,
                        retryCount2:0,
                        retryCount3:0,
                        cycleType:V.cycleTypes,
                        sellingData:{
                            step1:{
                                status:"none",
                            },
                            step2:{
                                status:"none",
                            },
                            step3:{
                                status:"none",
                            },
                        },
                        RunSycle: true,
                        RunSycle1: true,
                        RunSycle2: true,
                        RunSycle3: true,
                        status:V.status,
                        selling:false,
                        percentToGet:0.2,
                        SellBuyData1:{},
                        SellBuyData2:{},
                        SellBuyData3:{},
                        SellBuyData1S:"none",
                        SellBuyData2S:"none",
                        SellBuyData3S:"none",
                        checkStatus:0,
                        testS:0,
                        testE:0,
                        name:`IRT_USDT_${UPC}_IRT`,
                        cycle:[`${UPC}IRT`, `${UPC}USDT`,`USDTIRT`],
                        cycleR:[`USDTIRT`, `${UPC}USDT`,`${UPC}IRT`],
                        XX:UPC,
                        sood:0,
                        PD:V.Price_Desimal,
                        Do_Cycle:[
                            ["rls",K,"buy","XXIRZ",V.CR_Desimal],
                            ["usdt",K,"sell","XXUSZ",V.CR_Desimal],
                            ["rls","usdt","sell","USIRZ",2],
                        ],
                        Do_CycleR:[
                            ["rls","usdt","buy","USIRZ",2],
                            ["usdt",K,"buy","",V.CR_Desimal],
                            ["rls",K,"sell","",V.CR_Desimal],
                        ],

                    }
                }


            }

        })
        NOB.CR_Setting=CR_Setting
        NOB.NobitexData=NobitexData
        console.log("NOB-CreateNobData-"+Date.now())
        Options.RunCount++
        Options.LastRunTime=Date.now()
        CB(true)
    }catch (e){
        try {IMP.P.BlocksRuned[X.id].options.ErrorCount++}catch (e) {}
        CB(false)
    }

}

export const NOB_User_CheckAll=(X,IMP,CB)=>{
    let randomString=IMP.randomString

    try {

        let NOB=IMP.P.NOB[X.name]
        let CO=IMP.P.NOB.CO
        NOB.chekCount=0
        let IND=IMP.Func.IND
        let RT=IMP.Func.RT

        // let CALC_S_IRT_BASE=(V,irt,isMarket=true,USIRZ=true,XXIRZ=true,XXUSZ=true,SBD1,SBD2,SBD3)=>{
        let CALC_S_IRT_BASE=(V,irt,SBD1,SBD2,SBD3)=>{

            let AX={};
            try {

                let FeeT = NOB.takerFee

                let FeeM = NOB.makerFee


                let digit1=V.Do_Cycle[0][4];
                let digit2=V.Do_Cycle[1][4];
                let digit3=V.Do_Cycle[2][4];




                let irtRemain= irt ;//100;
                let XX_CAN_BUY=0;
                let close=false;
                AX.P1=Number(SBD1.bids[0][0])
                AX.P2=Number(SBD2.bids[0][0])
                AX.P3=Number(SBD3.bids[0][0])

                AX.P1a=Number(SBD1.asks[0][0])
                AX.P2a=Number(SBD2.asks[0][0])
                AX.P3a=Number(SBD3.asks[0][0])



                // if(!isMarket){
                    AX.S1_DIFF=AX.P1-AX.P1a
                    AX.S2_DIFF=AX.P2-AX.P2a
                    AX.S3_DIFF=AX.P3-AX.P3a

                    let PercLimit=NOB.PercLimit
                    let PD=V.PD
                    AX.S1_BeetW=(AX.P1+AX.P1a)/2
                    AX.S2_BeetW=(AX.P2+AX.P2a)/2
                    AX.S3_BeetW=(AX.P3+AX.P3a)/2
                    let PD1
                    let PD2
                    let PD3
                    if(V.Do_Cycle[0][0]==='rls'){PD1=0}else {PD1=PD}
                    if(V.Do_Cycle[1][0]==='rls'){PD2=0}else {PD2=PD}
                    if(V.Do_Cycle[2][0]==='rls'){PD3=0}else {PD3=PD}

                    AX.S1_Beet=RT(AX.P1a+(AX.P1*(PercLimit/100)),PD1)
                    AX.S2_Beet=RT(AX.P2a+(AX.P2*(PercLimit/100)),PD2)
                    AX.S3_Beet=RT(AX.P3a+(AX.P3*(PercLimit/100)),PD3)

                    AX.S1_BeetM=RT(AX.P1-(AX.P1*(PercLimit/100)),PD1)
                    AX.S2_BeetM=RT(AX.P2-(AX.P2*(PercLimit/100)),PD2)
                    AX.S3_BeetM=RT(AX.P3-(AX.P3*(PercLimit/100)),PD3)
                // }



                let List1

                // if(!isMarket && !XXIRZ){
                //     // List1=V.SellBuyData1.asks
                //     XX_CAN_BUY=irtRemain/AX.S1_Beet
                //     irtRemain=0
                //     close=true
                // }else {
                    List1=SBD1.bids
                    List1.forEach( (bids,k)=>{

                        let B0=Number(bids[0])
                        let B1=Number(bids[1])

                        if(!close){
                            let DIS=irtRemain-(B0*B1)   // (100-50=50 )     (50-5.1=44.9)
                            if(DIS>0){
                                XX_CAN_BUY+=B1
                                irtRemain-=(B0*B1)
                            }else {
                                XX_CAN_BUY+=irtRemain/B0
                                irtRemain=0
                                close=true
                            }

                        }

                    });
                // }



                AX.OK1=IND(close)
                AX.IRT=irt
                AX.XX_CAN_BUY=XX_CAN_BUY

                AX.IRT_TO_XX2 = XX_CAN_BUY

                AX.IRT_TO_XX_USABLE2 = RT(AX.IRT_TO_XX2,digit1 )/////////////////used for 1
                AX.USE1=AX.IRT_TO_XX_USABLE2

                AX.IRT_SAVED =(XX_CAN_BUY-AX.IRT_TO_XX_USABLE2) *AX.P1

                AX.XX_RESIVE2 = AX.IRT_TO_XX_USABLE2* (1 - FeeT)

                AX.XX_FEE= AX.IRT_TO_XX_USABLE2 - AX.XX_RESIVE2

                AX.XX_USABLE2 = RT(AX.XX_RESIVE2,digit2 )////////////////////used for  2
                AX.USE2=AX.XX_USABLE2

                AX.XX_SAVED2 = AX.XX_RESIVE2-AX.XX_USABLE2

                AX.XX_SAVED_BY_IRT2 = AX.XX_SAVED2 *AX.P1

                let USDT_CAN_BUY=0
                let XXRemain=AX.XX_USABLE2 //0.001291 // 1454.7

                close=false;
                // if(!isMarket && !XXUSZ){
                //     USDT_CAN_BUY=(XXRemain*AX.S2_BeetM)
                //     XXRemain=0
                //     close=true
                // }else {
                    SBD2.asks.forEach( (asks,k)=>{

                        let A0= Number(asks[0])
                        let A1= Number(asks[1])

                        if(!close){
                            let DIS= XXRemain-A1   // 1454.7
                            if(DIS>0){
                                USDT_CAN_BUY+=(A1*A0)
                                XXRemain-=(A1)
                            }else {
                                USDT_CAN_BUY+=(XXRemain*A0)
                                XXRemain=0
                                close=true
                            }
                        }else {
                        }

                    });
                // }



                AX.OK2=IND(close)
                AX.USDT_CAN_BUY=USDT_CAN_BUY
                // AX.USDT_RESIVE2Old=USDT_CAN_BUY
                AX.USDT_RESIVE2=USDT_CAN_BUY*(1 - FeeT)
                AX.USDT_FEE=AX.USDT_CAN_BUY-AX.USDT_RESIVE2

                AX.USDT_USABLE2 = RT(AX.USDT_RESIVE2,digit3 )////////////////////used for  3
                AX.USE3=AX.USDT_USABLE2

                AX.USDT_SAVED2 = AX.USDT_RESIVE2-AX.USDT_USABLE2

                AX.USDT_SAVED_BY_IRT2 = AX.USDT_SAVED2 *AX.P3

                close=false
                let IRT_CAN_BUY=0
                let USDTRemain=AX.USDT_USABLE2 //48.2

                // if(!isMarket && !USIRZ){
                //     IRT_CAN_BUY=(USDTRemain*AX.S3_BeetM)
                //     USDTRemain=0
                //     close=true
                // }else {
                    SBD3.asks.forEach( (asks,k)=>{

                        let A0=Number(asks[0])
                        let A1=Number(asks[1])

                        if(!close){
                            let DIS=USDTRemain-A1   // (0.001291-50=50 )     (50-5.1=44.9)
                            if(DIS>0){
                                IRT_CAN_BUY+=(A1*A0)
                                USDTRemain-=(A1)
                            }else {
                                IRT_CAN_BUY+=(USDTRemain*A0)
                                USDTRemain=0
                                close=true
                            }

                        }
                    });
                // }


                AX.OK3=IND(close)
                AX.IRT_RESIVE2=IRT_CAN_BUY

                AX.IRT_RESIVE_FINAL=AX.IRT_RESIVE2*(1 - FeeT)
                AX.IRT_FEE=AX.IRT_RESIVE2-AX.IRT_RESIVE_FINAL

                AX.ALL_FEE_IRT=AX.IRT_FEE*3
                AX.ALL_SAVED_IRT=AX.XX_SAVED_BY_IRT2+AX.USDT_SAVED_BY_IRT2
                // AX.FINAL_IRT=(AX.IRT_RESIVE_FINAL+AX.ALL_SAVED_IRT)-AX.ALL_FEE_IRT
                AX.DIFF=AX.IRT_RESIVE2-(AX.IRT-AX.IRT_SAVED)

                AX.sood=((AX.DIFF-AX.ALL_FEE_IRT)+AX.ALL_SAVED_IRT )/10

                return AX
            }catch (e) {
                AX.sood=-1000000
                return AX
            }
        };

        // let CALC_R_IRT_BASE=(V,irt,isMarket=true,USIRZ=true,XXIRZ=true,XXUSZ=true,SBD1,SBD2,SBD3)=>{
        let CALC_R_IRT_BASE=(V,irt,SBD1,SBD2,SBD3)=>{
            let AX={};
            try {


                // let FeeT = (roundTo(V.XX_Fee.taker_fee / 100, 4))
                // let FeeM = (roundTo(V.XX_Fee.maker_fee / 100, 4))

                let FeeT = NOB.takerFee

                let FeeM = NOB.makerFee

                let digit1=V.Do_CycleR[0][4];
                let digit2=V.Do_CycleR[1][4];
                let digit3=V.Do_CycleR[2][4];

                AX.P1=Number(SBD1.bids[0][0])
                AX.P2=Number(SBD2.bids[0][0])
                AX.P3=Number(SBD3.bids[0][0])

                AX.P1a=Number(SBD1.asks[0][0])
                AX.P2a=Number(SBD2.asks[0][0])
                AX.P3a=Number(SBD3.asks[0][0])


                // if(!isMarket){
                    AX.S1_DIFF=AX.P1-AX.P1a
                    AX.S2_DIFF=AX.P2-AX.P2a
                    AX.S3_DIFF=AX.P3-AX.P3a

                    let PercLimit=NOB.PercLimit
                    let PD=V.PD
                    AX.S1_BeetW=(AX.P1+AX.P1a)/2
                    AX.S2_BeetW=(AX.P2+AX.P2a)/2
                    AX.S3_BeetW=(AX.P3+AX.P3a)/2
                    let PD1
                    let PD2
                    let PD3
                    if(V.Do_CycleR[0][0]==='rls'){PD1=0}else {PD1=PD}
                    if(V.Do_CycleR[1][0]==='rls'){PD2=0}else {PD2=PD}
                    if(V.Do_CycleR[2][0]==='rls'){PD3=0}else {PD3=PD}

                    AX.S1_Beet=RT(AX.P1a+(AX.P1*(PercLimit/100)),PD1)
                    AX.S2_Beet=RT(AX.P2a+(AX.P2*(PercLimit/100)),PD2)
                    AX.S3_Beet=RT(AX.P3a+(AX.P3*(PercLimit/100)),PD3)

                    AX.S1_BeetM=RT(AX.P1-(AX.P1*(PercLimit/100)),PD1)
                    AX.S2_BeetM=RT(AX.P2-(AX.P2*(PercLimit/100)),PD2)
                    AX.S3_BeetM=RT(AX.P3-(AX.P3*(PercLimit/100)),PD3)
                // }

                let irtRemain= IND(irt) ;//100;
                let USDT_CAN_BUY=0;
                let close=false;

                let List1

                // if(!isMarket && !USIRZ){
                //     USDT_CAN_BUY+=irtRemain/AX.S3_Beet
                //     irtRemain=0
                //     close=true
                // }else {
                    List1=SBD3.bids
                    List1.forEach( (A,k)=>{

                        let B0=Number(A[0])
                        let B1=Number(A[1])

                        // [
                        // "243600",
                        // "8790.46"
                        // ]

                        if(!close){
                            let DIS=irtRemain-(B0*B1)
                            if(DIS>0){
                                USDT_CAN_BUY+=B1
                                irtRemain-=(B0*B1)
                            }else {
                                USDT_CAN_BUY+=irtRemain/B0
                                irtRemain=0
                                close=true
                            }

                        }

                    });
                // }


                AX.OK1=IND(close)

                AX.IRT=irt
                AX.IRT_TO_USDT = USDT_CAN_BUY
                AX.IRT_TO_USDT_USABLE = RT(AX.IRT_TO_USDT,digit1 )///step 1
                AX.USE1=AX.IRT_TO_USDT_USABLE
                AX.IRT_SAVED=(AX. IRT_TO_USDT-AX.IRT_TO_USDT_USABLE)*AX.P3

                // AX.USDT_SAVED=AX. IRT_TO_USDT-AX.IRT_TO_USDT_USABLE
                // AX.USDT_SAVED_BY_IRT=AX.USDT_SAVED*AX.P3
                AX.USDT_RESIVE = AX.IRT_TO_USDT_USABLE* (1 - FeeT)
                AX.USDT_FEE=AX. IRT_TO_USDT_USABLE-AX. USDT_RESIVE

                let XX_CAN_BUY=0 // 28
                let USDTRemain=AX.USDT_RESIVE //28

                close=false;

                let List2

                // if(!isMarket && !XXUSZ){
                //     // List2=V.SellBuyData2.asks
                //     XX_CAN_BUY=(USDTRemain/AX.S2_Beet)
                //     USDTRemain=0
                //     close=true
                // }else {
                    List2=SBD2.bids
                    List2.forEach( (A,k)=>{

                        let A0= Number(A[0]) //
                        let A1= Number(A[1]) //


                        if(!close){
                            let DIS= USDTRemain - (A1*A0)   // 33.28
                            if(DIS>0){
                                XX_CAN_BUY+=(A1) //
                                USDTRemain-=(A1*A0)
                            }else {
                                XX_CAN_BUY+=(USDTRemain/A0)
                                USDTRemain=0
                                close=true
                            }
                        }else {
                        }

                    });
                // }



                AX.OK2=IND(close)

                AX.XX_USABLE = RT(XX_CAN_BUY,digit2 ) // step 2
                AX.USE2=AX.XX_USABLE
                AX.XX_SAVED0 = XX_CAN_BUY-AX.XX_USABLE
                AX.XX_SAVED_BY_IRT0 = AX.XX_SAVED0 *AX.P1

                AX.XX_RESIVE = AX.XX_USABLE*(1 - FeeT)//
                AX.XX_RESIVE_ROUNDED = RT(AX.XX_RESIVE,digit3 )// step3
                AX.USE3=AX.XX_RESIVE_ROUNDED

                AX.XX_FEE=AX.XX_USABLE-AX.XX_RESIVE

                // AX.XX_SAVED = XX_CAN_BUY-AX.XX_USABLE
                AX.XX_SAVED = AX.XX_RESIVE-AX.XX_RESIVE_ROUNDED
                AX.XX_SAVED_BY_IRT = AX.XX_SAVED *AX.P1




                close=false
                let IRT_CAN_BUY=0
                let XXRemain=AX.XX_RESIVE_ROUNDED //0.000896

                // if(!isMarket && !XXIRZ){
                //     IRT_CAN_BUY=(XXRemain*AX.S1_BeetM)
                //     XXRemain=0
                //     close=true
                // }else {
                    SBD1.asks.forEach( (A,k)=>{

                        let A0=Number(A[0])
                        let A1=Number(A[1])

                        // [
                        // "7750000000",
                        // "0.006084"
                        // ]

                        if(!close){
                            let DIS=XXRemain-A1   // (0.001291-50=50 )     (50-5.1=44.9)
                            if(DIS>0){
                                IRT_CAN_BUY+=(A1*A0)
                                XXRemain-=(A1)
                            }else {
                                IRT_CAN_BUY+=(XXRemain*A0)
                                XXRemain=0
                                close=true
                            }

                        }
                    });
                // }



                AX.OK3=IND(close)

                AX.IRT_RESIVE=IRT_CAN_BUY
                AX.IRT_RESIVE_FINAL=AX.IRT_RESIVE*(1 - FeeT)
                AX.IRT_FEE=AX.IRT_RESIVE-AX.IRT_RESIVE_FINAL
                // AX.SAVED_ALL_P=AX.XX_SAVED_BY_IRT+AX.USDT_SAVED_BY_IRT
                // AX.SAVED_ALL=Number(AX.IRT)-AX.SAVED_ALL_P

                AX.ALL_FEE_IRT=AX.IRT_FEE*3
                AX.ALL_SAVED_IRT=AX.XX_SAVED_BY_IRT+AX.XX_SAVED_BY_IRT0

                // AX.FINAL_IRT=(AX.IRT_RESIVE_FINAL+AX.ALL_SAVED_IRT)-AX.ALL_FEE_IRT

                // AX.sood=(AX.FINAL_IRT- AX.IRT )/10

                AX.DIFF=AX.IRT_RESIVE-(AX.IRT-AX.IRT_SAVED)

                AX.sood=((AX.DIFF-AX.ALL_FEE_IRT)+AX.ALL_SAVED_IRT )/10

                return AX
            }catch (e) {
                AX.sood=-1000000
                return AX
            }
        };

        let Calc_IRT_BASE = (V,SBD1,SBD2,SBD3) => {

            try {
                let callSoodStart=NOB.callSoodStart
                let callSoodEnd=NOB.callSoodEnd
                let callSoodStep=NOB.callSoodStep

                let irt = NOB.RLSDO*10;
                let sood=0
                if (V.type === 'S') {
                    // let AX1 = CALC_S_IRT_BASE(V, irt,true,true,true,true,SBD1,SBD2,SBD3)
                    let AX1 = CALC_S_IRT_BASE(V, irt,SBD1,SBD2,SBD3)
                    //let AX1L = CALC_S_IRT_BASE(V, irt,false,USIRZ,XXIRZ,XXUSZ)
                    //V.soodL=AX1L.sood
                    V.soodL=0
                    V.AX1 = AX1
                    //V.AX1L = AX1L
                    //V.IRT_XX = AX1.IRT_TO_XX_USABLE2
                    sood=AX1.sood
                    V.soodS = AX1.sood
                    V.soodR=0
                    V.OK1=AX1.OK1
                    V.OK2=AX1.OK2
                    V.OK3=AX1.OK3
                }
                else {
                    // let AX1R = CALC_R_IRT_BASE(V, irt,true,true,true,true,SBD1,SBD2,SBD3)
                    let AX1R = CALC_R_IRT_BASE(V, irt,SBD1,SBD2,SBD3)
                    //let AX1RL = CALC_R_IRT_BASE(V, irt,false,USIRZ,XXIRZ,XXUSZ)
                    //V.soodL=AX1RL.sood
                    V.soodL=0
                    V.AX1R = AX1R
                    //V.AX1RL = AX1RL
                    sood=AX1R.sood
                    V.soodR = AX1R.sood
                    V.soodS=0
                    V.OK1=AX1R.OK1
                    V.OK2=AX1R.OK2
                    V.OK3=AX1R.OK3
                }
                V.sood =sood
                let SooBase
                // if(ReverseSycle){
                //     SooBase=V.soodL
                // }else {
                SooBase=V.sood
                // }


                if(SooBase>0 || NOB.calcCaps){
                    // if(sood>0 || true){
                    let AXC=[]
                    let AXC_R=[]

                    let CountAXC=0
                    let R=0
                    for(R=callSoodStart;R<callSoodEnd+IND(irt);R=R+callSoodStep){

                        if(V.type==='S'){
                            // let ST=CALC_S_IRT_BASE(V,R,!ReverseSycle,USIRZ,XXIRZ,XXUSZ,SBD1,SBD2,SBD3)
                            let ST=CALC_S_IRT_BASE(V,R,SBD1,SBD2,SBD3)
                            if(ST.OK1 && ST.OK2 && ST.OK3){
                                AXC.push({sood:ST.sood,IRT:ST.IRT,OK1:ST.OK1 , OK2:ST.OK2 , OK3:ST.OK3})
                            }else {break;}
                        }else {
                            // let RE=CALC_R_IRT_BASE(V,R,!ReverseSycle,USIRZ,XXIRZ,XXUSZ,SBD1,SBD2,SBD3)
                            let RE=CALC_R_IRT_BASE(V,R,SBD1,SBD2,SBD3)
                            if(RE.OK1 && RE.OK2 && RE.OK3){
                                AXC_R.push({sood:RE.sood,IRT:RE.IRT,OK1:RE.OK1 , OK2:RE.OK2 , OK3:RE.OK3})
                            }else {break;}
                        }

                        CountAXC++
                    }

                    V.CountAXC=CountAXC

                    if(V.type==='S'){
                        // let AXC_F=IND(AXC.filter(a=>a.sood>0))
                        // let AXC_F=AXC[0]
                        // let AXC_F_A=IND(AXC[0])
                        // if(AXC_F[0]===undefined){
                        //     V.AXC_F=AXC_F_A
                        // }else {
                        //     V.AXC_F=AXC_F[0]
                        // }
                        //
                        // let AXC_E=IND(AXC.filter(a=>a.sood>0))
                        // let AXC_E_A=IND(AXC.pop())
                        // if(AXC_E[0]===undefined){
                        //     V.AXC_E=AXC_E_A
                        // }else {
                        //     V.AXC_E=AXC_E.pop()
                        // }
                        V.AXC_F=IND(AXC[0])
                        V.AXC_E=IND(AXC.pop())

                        V.AXC=AXC.sort((a,b)=>{
                            if(a.sood===b.sood){return 0}
                            if(a.sood>b.sood){return -1}
                            if(a.sood<b.sood){return 1}
                        });
                        V.MaxSood=V.AXC[0]


                    }
                    else {
                        // let AXC_R_F=IND(AXC_R.filter(a=>a.sood>0))
                        // let AXC_R_F_A=IND(AXC_R[0])
                        // if(AXC_R_F[0]===undefined){
                        //     V.AXC_R_F=AXC_R_F_A
                        // }else {
                        //     V.AXC_R_F=AXC_R_F[0]
                        // }
                        //
                        // let AXC_R_E=IND(AXC_R.filter(a=>a.sood>0))
                        // let AXC_R_E_A=IND(AXC_R.pop())
                        // if(AXC_R_E[0]===undefined){
                        //     V.AXC_R_E=AXC_R_E_A
                        // }else {
                        //     V.AXC_R_E=AXC_R_E.pop()
                        // }
                        V.AXC_R_F=IND(AXC_R[0])
                        V.AXC_R_E=IND(AXC_R.pop())

                        V.AXC_R=AXC_R .sort((a,b)=>{
                            if(a.sood===b.sood){return 0}
                            if(a.sood>b.sood){return -1}
                            if(a.sood<b.sood){return 1}
                        });
                        V.MaxSood=V.AXC_R[0]
                    }
                }
                else {
                    V.AXC_E={}
                    V.AXC_F={}
                    V.AXC={}
                    V.AXC_R_F={}
                    V.AXC_R_E={}
                    V.AXC_R={}
                    V.MaxSood={}
                    V.CountAXC=0

                }

                try {
                    let now =Date.now()
                    // V.RST1=now - V.SellBuyData1.time
                    // V.RST2=now - V.SellBuyData2.time
                    // V.RST3=now - V.SellBuyData3.time
                    // V.RQT1=now - V.SellBuyData1.reqTime
                    // V.RQT2=now - V.SellBuyData2.reqTime
                    // V.RQT3=now - V.SellBuyData3.reqTime

                    V.RST1=now - CO.stats.Time
                    V.RST2=now - CO.stats.Time
                    V.RST3=now - CO.stats.Time
                    V.RQT1=now - CO.stats.reqTime
                    V.RQT2=now - CO.stats.reqTime
                    V.RQT3=now - CO.stats.reqTime

                    V.RST1Pure=CO.stats.Time
                    V.RST2Pure=CO.stats.Time
                    V.RST3Pure=CO.stats.Time
                    V.RQT1Pure=CO.stats.reqTime
                    V.RQT2Pure=CO.stats.reqTime
                    V.RQT3Pure=CO.stats.reqTime

                    V.RST1LastUpdate=now - SBD1.lastUpdate
                    V.RST2LastUpdate=now - SBD2.lastUpdate
                    V.RST3LastUpdate=now - SBD3.lastUpdate

                    V.RST1LastUpdatePure=SBD1.lastUpdate
                    V.RST2LastUpdatePure=SBD2.lastUpdate
                    V.RST3LastUpdatePure=SBD3.lastUpdate

                    V.DiffTime1=V.RST1Pure-V.RST1LastUpdatePure
                    V.DiffTime2=V.RST2Pure-V.RST2LastUpdatePure
                    V.DiffTime3=V.RST2Pure-V.RST3LastUpdatePure


                    // let {minValidReq, minValidRes}= this.state
                    if(
                        (V.RST1< NOB.validReqTime ) &&
                        (V.RST2< NOB.validReqTime ) &&
                        (V.RST3< NOB.validReqTime )
                    ){
                        V.RSTV=true
                    }else {
                        V.RSTV=false
                    }
                    if(
                        (V.RQT1< NOB.validResTime ) &&
                        (V.RQT2< NOB.validResTime ) &&
                        (V.RQT3< NOB.validResTime )
                    ){
                        V.RQTV=true
                    }else {
                        V.RQTV=false
                    }



                }catch (e) {

                }

                if(V.type==='S'){
                    let price1=null
                    let price2=null
                    let price3=null
                    let price1R=null
                    let price2R=null
                    let price3R=null
                        if(V.Do_Cycle[0][2]==='buy'){
                            price1=Number(SBD1.bids[0][0])+(Number(SBD1.bids[0][0])*NOB.prisePercent/100)
                            price1R=Number(SBD1.bids[0][0])
                        }else {
                            price1=Number(SBD1.asks[0][0])+(Number(SBD1.asks[0][0])*NOB.prisePercentSell/100)
                            price1R=Number(SBD1.asks[0][0])
                        }

                        if(V.Do_Cycle[1][2]==='buy'){
                            price2=Number(SBD2.bids[0][0])+(Number(SBD2.bids[0][0])*NOB.prisePercent/100)
                            price2R=Number(SBD2.bids[0][0])
                        }else {
                            price2=Number(SBD2.asks[0][0])+(Number(SBD2.asks[0][0])*NOB.prisePercentSell/100)
                            price2R=Number(SBD2.asks[0][0])
                        }

                        if(V.Do_Cycle[2][2]==='buy'){
                            price3=Number(SBD3.bids[0][0])+(Number(SBD3.bids[0][0])*NOB.prisePercent/100)
                            price3R=Number(SBD3.bids[0][0])
                        }else {
                            price3=Number(SBD3.asks[0][0])+(Number(SBD3.asks[0][0])*NOB.prisePercentSell/100)
                            price3R=Number(SBD3.asks[0][0])
                        }

                    // }else {
                    //     price1=null
                    //     price2=null
                    //     price3=null
                    // }
                    let PD=V.PD
                    let PD1
                    let PD2
                    let PD3
                    if(V.Do_Cycle[0][0]==='rls'){PD1=0}else {PD1=PD}
                    if(V.Do_Cycle[1][0]==='rls'){PD2=0}else {PD2=PD}
                    if(V.Do_Cycle[2][0]==='rls'){PD3=0}else {PD3=PD}

                V.SellBuyData1.price=RT(price1,PD1)
                V.SellBuyData1.priceR=RT(price1R,PD1)
                V.SellBuyData2.price=RT(price2,PD2)
                V.SellBuyData2.priceR=RT(price2R,PD2)
                V.SellBuyData3.price=RT(price3,PD3)
                V.SellBuyData3.priceR=RT(price3R,PD3)

                }
                else {
                    let price1=null
                    let price2=null
                    let price3=null
                    let price1R=null
                    let price2R=null
                    let price3R=null

                        if(V.Do_CycleR[0][2]==='buy'){
                            price1=Number(SBD3.bids[0][0])+(Number(SBD3.bids[0][0])*NOB.prisePercent/100)
                            price1R=Number(SBD3.bids[0][0])
                        }else {
                            price1=Number(SBD3.asks[0][0])+(Number(SBD3.asks[0][0])*NOB.prisePercentSell/100)
                            price1R=Number(SBD3.asks[0][0])
                        }

                        if(V.Do_CycleR[1][2]==='buy'){
                            price2=Number(SBD2.bids[0][0])+(Number(SBD2.bids[0][0])*NOB.prisePercent/100)
                            price2R=Number(SBD2.bids[0][0])
                        }else {
                            price2=Number(SBD2.asks[0][0])+(Number(SBD2.asks[0][0])*NOB.prisePercentSell/100)
                            price2R=Number(SBD2.asks[0][0])
                        }

                        if(V.Do_CycleR[2][2]==='buy'){
                            price3=Number(SBD1.bids[0][0])+(Number(SBD1.bids[0][0])*NOB.prisePercent/100)
                            price3R=Number(SBD1.bids[0][0])
                        }else {
                            price3=Number(SBD1.asks[0][0])+(Number(SBD1.asks[0][0])*NOB.prisePercentSell/100)
                            price3R=Number(SBD1.asks[0][0])
                        }

                    // }else {
                    //     price1=null
                    //     price2=null
                    //     price3=null
                    // }
                    let PD=V.PD
                    let PD1
                    let PD2
                    let PD3
                    if(V.Do_CycleR[0][0]==='rls'){PD1=0}else {PD1=PD}
                    if(V.Do_CycleR[1][0]==='rls'){PD2=0}else {PD2=PD}
                    if(V.Do_CycleR[2][0]==='rls'){PD3=0}else {PD3=PD}

                    V.SellBuyData1.price=RT(price1,PD1)
                    V.SellBuyData1.priceR=RT(price1R,PD1)
                    V.SellBuyData2.price=RT(price2,PD2)
                    V.SellBuyData2.priceR=RT(price2R,PD2)
                    V.SellBuyData3.price=RT(price3,PD3)
                    V.SellBuyData3.priceR=RT(price3R,PD3)
                }
            }catch (e) {

            }
        };

        let CheckAll=()=>{
            try {
                let Options=IMP.P.BlocksRuned[X.id].options
                NOB.chekCount++
                Object.entries(NOB.NobitexData)
                    .map(([K, V], key) => {

                        //let CrListR=IND(IMP.P.NOB.CO.stats.CrListR);
                        let SBD1=CO.stats.CrListR[V.cycle[0]]
                        let SBD2=CO.stats.CrListR[V.cycle[1]]
                        let SBD3=CO.stats.CrListR[V.cycle[2]]

                        if ( SBD1 !== undefined && SBD2 !== undefined && SBD3 !== undefined ) {


                            // V.SellBuyData1 = SBD1
                            // V.SellBuyData2 = SBD2
                            // V.SellBuyData3 = SBD3
                            //V.Time=

                            //V.cycleType=cycleTypes[V.XX.toLowerCase()]
                            //V.status=statuses[V.XX.toLowerCase()]

                            if(V.base==='IRT'){
                                Calc_IRT_BASE(V,SBD1,SBD2,SBD3)
                            }

                            /*if(V.base==='USDT'){
                                this.Calc_USDT_BASE(V)
                            }

                            if(V.base==='XX'){
                                this.Calc_XX_BASE(V)
                            }*/

                        }

                    })

                setTimeout(()=>{
                    if(Options.status) {
                        CheckAll()
                    }
                },NOB.newCheckAll)

                Options.RunCount++
                Options.LastRunTime=Date.now()
            }catch (e) {

            }
        }

        CheckAll()

        setTimeout(()=>{
            CB(true)
        },500)

    }catch (e) {
        // console.log(e);
        try {IMP.P.BlocksRuned[X.id].options.ErrorCount++}catch (e) {}
        try {IMP.P.ErrorLogs[`NOB_CheckAll_${Date.now()}_${randomString({length: 5})}`]=e} catch (e) {}
        CB(false)
    }

}

export const NOB_User_WalletCycle=(X,IMP,CB)=>{

    let ver=5
    let randomString=IMP.randomString

    try {

        let NOB=IMP.P.NOB[X.name]
        let CO=IMP.P.NOB.CO
        let IND=IMP.Func.IND
        let axios=IMP.axios
        let doEncrypt=IMP.Func.doEncrypt
        let doDecrypt=IMP.Func.doDecrypt
        let momentM=IMP.momentM

        console.log('NOB_WalletCycle_Runed');

        const Error=(e,t='-1')=>{
            try {IMP.P.BlocksRuned[X.id].options.ErrorCount++}catch (e) {}
            try {IMP.P.ErrorLogs[`NOB_User_WalletCycle${Date.now()}_${randomString({length: 5})}_T=${t}`]=e} catch (e) {}
            // console.log(t,e);
            CB(false)
        }

        let AxiosNob=(callback) => {

            let route=NOB.nobCallUrl
            let url
            let mainUrl

            if(NOB.orderback=='1'){//random server list
                let data= {
                    data: {
                        method: 'post',
                        data: {},
                        token: NOB.nobitexT,
                        url: NOB.mainDomain+"/users/wallets/list"
                    }
                }
                const urls = [];
                CO.serverIpList.forEach((s)=>{
                    if(s.status==='ok'){
                        urls.push(s.AD)
                    }
                })
                const random = Math.floor(Math.random() * urls.length);
                url=urls[random]+route
                mainUrl=urls[random]

                data.timeReq=momentM().valueOf()
                let options = {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {data:doEncrypt(JSON.stringify(data),IMP.P.roro)},
                    timeout:10000,
                    url:url,
                };

                axios(options)
                    .then(response => {
                            response.data = JSON.parse(doDecrypt(response.data, IMP.P.roro))
                            callback(response, true)
                        }
                    )
                    .catch(error => {
                        try {
                            // NOB.serverIpList.find(s=>s.AD===mainUrl).error++
                        }catch (e){}
                        try {
                            console.log(IND(error),'Error-----');
                        }catch (e){}
                        try {
                            console.log(IND(error.response),'Error-----');
                        }catch (e){}
                        try {
                            let R=error

                            R = JSON.parse(doDecrypt(error, IMP.P.roro))
                            console.log(IND(error),'Error-----');
                            console.log(R,'Error-----');
                        }catch (e){
                        }
                        callback('Error', false)
                    })

            }

            else if(NOB.orderback=='local') {
                let options = {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token '+NOB.nobitexT,
                    },
                    data: {},
                    timeout:10000,
                    url: NOB.mainDomain+"/users/wallets/list",
                };
                // console.log(options);
                axios(options)
                    .then(response => {
                            // response.data = JSON.parse(doDecrypt(response.data, IMP.P.roro))
                            // console.log(response.data);
                            callback(response, true)
                        }
                    )
                    .catch(error => {
                        // try {
                        //     // NOB.serverIpList.find(s=>s.AD===mainUrl).error++
                        // }catch (e){}
                        // try {
                        //     // console.log(IND(error),'Error-----');
                        // }catch (e){}
                        // try {
                        //     // console.log(IND(error.response),'Error-----');
                        // }catch (e){}
                        // try {
                        //     // let R=error
                        //     //
                        //     // R = JSON.parse(doDecrypt(error, IMP.P.roro))
                        //     // console.log(IND(error),'Error-----');
                        //     // console.log(R,'Error-----');
                        // }catch (e){
                        // }
                        callback({'Error':error.response}, false)
                    })
            }

            else {
                //will develop later
                callback(null, true)
            }

        };

        let walletCycle=()=>{

            let Options=IMP.P.BlocksRuned[X.id].options
            try {


                AxiosNob(async(R, S) => {
                    if (S) {
                        //console.log(R.data);
                        try {
                            if (R.data.status === 'ok') {
                                NOB.lastWalletTime=momentM().valueOf()
                                R.data.wallets.forEach(e=>{
                                    try {
                                        if(NOB.Infos[e.currency]===undefined){
                                            NOB.Infos[e.currency]={}
                                        }else {}

                                        NOB.Infos[e.currency].wallet=e

                                    }catch (e) {

                                    }
                                })
                            }

                            Options.RunCount++
                            Options.LastRunTime=Date.now()

                        }catch (e) {
                            Error(e,'1')
                        }

                    }else {
                        Error(R,'2')
                    }

                },NOB.walletCycleTimeOut)

                let T
                let Selling=Object.entries(NOB.NobitexData)
                    .filter(([k, v]) => v.status)
                    .filter(([k, v]) => v.selling).length > 0
                if(Selling){
                    T=NOB.walletCycleTimeInSelling
                }else {
                    T=NOB.walletCycleTime
                }

                setTimeout(()=>{
                    try {
                        if(Options.status){
                            walletCycle()
                        }
                    }catch (e) {
                        //Error(e,0)
                    }
                },T)

            }catch (e) {
                Error(e,'3')
            }
        }

        walletCycle()

        CB(true)

    }catch (e) {
        Error(e,'4')
    }


};

export const NOB_User_SellCycle=(X,IMP,CB)=>{

    try {
        let NOB=IMP.P.NOB[X.name]
        let CO=IMP.P.NOB.CO
        let roro=IMP.P.roro
        let IND=IMP.Func.IND
        let axios=IMP.axios
        let doEncrypt=IMP.Func.doEncrypt
        let RT=IMP.Func.RT
        let doDecrypt=IMP.Func.doDecrypt
        let momentM=IMP.momentM

        let AxiosN=async (data={},callback,timeout=30000) => {

            // let route='/tradinges/nobitex'
            let route=NOB.nobCallUrl
            let url
            let mainUrl

            if(NOB.orderback=='1'){
                const urls = [];
                NOB.serverIpList.forEach((s)=>{
                    if(s.status==='ok'){
                        urls.push(s.AD)
                    }
                })
                const random = Math.floor(Math.random() * urls.length);
                url=urls[random]+route
                mainUrl=urls[random]
            }else {
                url=NOB.orderback+route
                mainUrl=NOB.orderback
            }
            data.timeReq=momentM().valueOf()

            let options = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {data:doEncrypt(JSON.stringify(data),roro)},
                timeout:timeout,
                url:url,
            };
            // if (props.get.Settings.consolShow) {
            //     console.log('options',options);
            // }
            axios(options)
                .then(response => {

                        response.data = JSON.parse(doDecrypt(response.data, roro))

                        try {
                            NOB.serverIpList.find(s => s.AD === mainUrl).success++
                        } catch (e) {
                        }

                        callback(response, true)
                    }
                )
                .catch(error => {
                    try {
                        NOB.serverIpList.find(s=>s.AD===mainUrl).error++
                    }catch (e){}
                    try {
                        console.log(IND(error),'Error-----');
                    }catch (e){}
                    try {
                        console.log(IND(error.response),'Error-----');
                    }catch (e){}
                    try {
                        let R=error
                        // if (NOB.encryptRes) {
                        R = JSON.parse(doDecrypt(error, roro))
                        // }
                        console.log(IND(error),'Error-----');
                        console.log(R,'Error-----');
                    }catch (e){
                    }
                    callback('Error', false)
                })


        };

        let orderStatus=(id,CB)=>{


            let D = {
                data: {
                    method: 'post',
                    data: {id:id},
                    token: NOB.nobitexT,
                    // url: "https://api.nobitex.ir/market/orders/status",
                    url: NOB.mainDomain+"/market/orders/status"

                }
            };

            AxiosN( D, async(R, S) => {
                if (S) {
                    if (R.data.status === 'ok') {
                        CB(1,R.data)
                    }else {
                        CB(0)
                    }
                }else {
                    CB(0)
                }
            },NOB.orderStatusTimeOut)

        };

        let WalletCycle2=async(V,CB=()=>{},x,isMarket=true)=>{

            let D=NOB.orderStatusTimeDelay
            try {
                let R1Status=false;
                let R2Status=false;
                let R3Status=false;

                let TimeOut
                // if(isMarket){
                TimeOut=NOB.orderStatusTime
                // }else {
                //     TimeOut=NOB.orderStatusTimeL
                // }

                let Check1=()=>{
                    try{
                        orderStatus(V.R1.order.id,(s,r)=>{
                            try{
                                if(s){
                                    V.sellingData.step1.status=r.order.status
                                    if(r.order.status==='Done'){
                                        R1Status=true
                                        if(V.type==='S'){
                                            NOB.cycleHistory[x].S1.F=r.order
                                            NOB.cycleHistory[x].S1.R=r
                                        }else {
                                            NOB.cycleHistory[x].S3.F=r.order
                                            NOB.cycleHistory[x].S3.R=r
                                        }

                                        if(R2Status && R3Status){
                                            CB(true)
                                        }
                                    }else {
                                        setTimeout(()=>{
                                            try {
                                                if(r.order.status!=='Canceled'){
                                                    Check1()
                                                }
                                            }catch (e){
                                                if(r.order.status!=='Canceled'){
                                                    Check1()
                                                }
                                            }

                                        },TimeOut)
                                    }
                                }else {
                                    setTimeout(()=>{
                                        Check1()
                                    },TimeOut)
                                }
                            }catch (e) {
                                setTimeout(()=>{
                                    Check1()
                                },TimeOut)
                            }
                        })
                    }catch (e) {
                        setTimeout(()=>{
                            Check1()
                        },TimeOut)
                    }

                };

                let Check2=()=>{
                    try{
                        orderStatus(V.R2.order.id,(s,r)=>{
                            // console.log(V.R2.order.id,s,r);
                            try{
                                if(s){
                                    V.sellingData.step2.status=r.order.status
                                    if(r.order.status==='Done'){
                                        R2Status=true
                                        NOB.cycleHistory[x].S2.F=r.order
                                        NOB.cycleHistory[x].S2.R=r
                                        if(R1Status && R3Status){
                                            CB(true)
                                        }
                                    }else {
                                        setTimeout(()=>{
                                            try {
                                                if(r.order.status!=='Canceled'){
                                                    Check2()
                                                }
                                            }catch (e){
                                                if(r.order.status!=='Canceled'){
                                                    Check2()
                                                }
                                            }

                                        },TimeOut)

                                    }
                                }else {
                                    setTimeout(()=>{
                                        Check2()
                                    },TimeOut)
                                }
                            }catch (e) {
                                setTimeout(()=>{
                                    Check2()
                                },TimeOut)
                            }
                        })
                    }catch (e) {
                        setTimeout(()=>{
                            Check2()
                        },TimeOut)
                    }
                };

                let Check3=()=>{
                    try{
                        orderStatus(V.R3.order.id,(s,r)=>{
                            // console.log(V.R3.order.id,s,r);
                            try{
                                if(s){
                                    V.sellingData.step3.status=r.order.status
                                    if(r.order.status==='Done'){
                                        R3Status=true
                                        if(V.type==='S'){
                                            NOB.cycleHistory[x].S3.F=r.order
                                            NOB.cycleHistory[x].S3.R=r
                                        }else {
                                            NOB.cycleHistory[x].S1.F=r.order
                                            NOB.cycleHistory[x].S1.R=r
                                        }
                                        if(R1Status && R2Status){
                                            CB(true)
                                        }
                                    }else {
                                        setTimeout(()=>{
                                            try {
                                                if(r.order.status!=='Canceled'){
                                                    Check3()
                                                }
                                            }catch (e){
                                                if(r.order.status!=='Canceled'){
                                                    Check3()
                                                }
                                            }

                                        },TimeOut)
                                    }
                                }else {
                                    setTimeout(()=>{
                                        Check3()
                                    },TimeOut)
                                }
                            }catch (e) {
                                setTimeout(()=>{
                                    Check3()
                                },TimeOut)
                            }

                        })
                    }catch (e) {

                    }
                }

                setTimeout(()=>{ Check1();},D);
                setTimeout(()=>{ Check2();},D+10);
                setTimeout(()=>{ Check3();},D+20);

            }catch (e) {

            }

        };

        let EndCycle=(V)=>{

            try {
                setTimeout(async ()=>{
                    V.sellingData.step1.status='none'
                    V.sellingData.step2.status='none'
                    V.sellingData.step3.status='none'
                    delete V.R1
                    delete V.R2
                    delete V.R3
                    delete V.D1
                    delete V.D2
                    delete V.D3
                },15)

                V.selling=false

                Object.entries(NOB.NobitexData).map(([K,VV])=>{
                    if(VV.XX===V.XX && VV.type===V.type && V.base===VV.base){
                        VV.sellEndTime=momentM().valueOf()
                    }
                })

            }catch (e) {}

        }

        let checkStatusDo_Cycle2=(V,type,x='x',isMarket=true)=>{

            if(
                V.sellingData.step1.status==='done'&&
                V.sellingData.step2.status==='done'&&
                V.sellingData.step3.status==='done'
            ){
                NOB.cycleHistory[x].afters={}
                setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},1)
                WalletCycle2(V,async()=>{

                    setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},100)
                    setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},1000)
                    setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},2000)
                    setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},3000)
                    setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},6000)
                    setTimeout(()=>{NOB.cycleHistory[x].afters[Date.now()]=V.sood},10000)
                    EndCycle(V)
                },x,isMarket)
            }


        }

        let AddOrder=(CA, type = 'buy', execution = 'limit', dstCurrency , srcCurrency, amount , price ,S='none') => {

            /*if(NOB.consolShow){
                console.log({
                    type:type,
                    execution:execution,
                    dstCurrency:dstCurrency,
                    srcCurrency:srcCurrency,
                    amount:amount,
                    price:price,
                    S:S,
                });
            }*/

            let D = {
                data: {
                    method: 'post',
                    token: NOB.nobitexT,
                    data: {
                        amount: amount,
                        dstCurrency: dstCurrency,
                        execution: execution,// "limit", market
                        price: price,
                        srcCurrency: srcCurrency,
                        type: type,//sell buy
                    },
                    url: "https://api.nobitex1.ir/market/orders/add"
                    // url: "https://api-f.nobitex1.ir/market/orders/add"
                }
            }
            // console.log(D,'D---');
            NOB.requestCount++
            AxiosN( D, (R, S) => {
                if (S) {
                    if (R.data.status === 'ok') {
                        CA(true, R.data, D)
                    } else {
                        CA(false, R.data, D)
                    }
                } else {
                    CA(false, R, D)
                }
            },NOB.AddOrderTimeOut)
            // }

        };

        let Do_CycleM = async(V,isMarket=true) => {

            let A1
            let A2
            let A3

            if(V.type==='S'){
                A1=V.Do_Cycle[0]
                A2=V.Do_Cycle[1]
                A3=V.Do_Cycle[2]
            }
            else {
                A1=V.Do_CycleR[0]
                A2=V.Do_CycleR[1]
                A3=V.Do_CycleR[2]
            }

            let delay=NOB.to_retry_delay

            let  x = Date.now()+'_'+randomString({length: 5});

            V.selling=true;
            V.retryCount=0;
            V.retryCount1=0;
            V.retryCount2=0;
            V.retryCount3=0;


            const S1 = async (type=1) => {

                if(type===1){
                    V.sellingData.step1.status='try'
                }

                if(type===2){
                    V.sellingData.step1.status='retry'
                }


                let use
                let price
                if(isMarket){
                    if(V.type==='S'){
                        use=V.AX1.USE1
                    }else {
                        use=V.AX1R.USE1
                    }

                    price=V.SellBuyData1.price
                }
                else {
                    if(V.type==='S'){
                        use=V.AX1L.USE1
                        if(A1[2]==='buy'){
                            price=V.AX1L.S1_Beet
                        }else {
                            price=V.AX1L.S1_BeetM
                        }

                    }else {
                        use=V.AX1RL.USE1
                        if(A1[2]==='buy'){
                            price=V.AX1RL.S3_Beet
                        }else {
                            price=V.AX1RL.S3_BeetM
                        }
                    }

                }


                AddOrder((S, R, D) => {
                    NOB.cycleHistory[x].S1={S:S,R:R,D:D,T:Date.now()}
                    if (S) {
                        try {V.R1=R;V.D1=D}catch (e) {}
                        V.RunSycle1=false;
                        V.sellingData.step1.status='ok'
                        setTimeout(async() => {
                            V.sellingData.step1.status='done'

                            checkStatusDo_Cycle2(V,'',x,isMarket)

                        }, 10)
                    } else {
                        V.sellingData.step1.status='to_retry'
                        V.retryCount1++

                        setTimeout(() => {

                            if(V.retryCount1>NOB.retryCount){

                                V.sellingData.step1.status='Canceled'

                            }else {
                                if (V.RunSycle1) {
                                    S1(2)
                                }
                            }

                        },delay)
                    }

                }, A1[2], isMarket?'market':'limit', A1[0], A1[1], RT(Number(use), A1[4]), price,'S1')

            };

            const S2 =async (type=1) => {

                if(type===1){
                    V.sellingData.step2.status='try'
                }
                if(type===2){
                    V.sellingData.step2.status='retry'
                }

                let use
                let price
                if(isMarket){
                    if(V.type==='S'){
                        use=V.AX1.USE2
                    }else {
                        use=V.AX1R.USE2
                    }

                    price=V.SellBuyData2.price
                }
                else {
                    if(V.type==='S'){
                        use=V.AX1L.USE2
                        if(A2[2]==='buy'){
                            price=V.AX1L.S2_Beet
                        }else {
                            price=V.AX1L.S2_BeetM
                        }

                    }else {
                        use=V.AX1RL.USE2
                        if(A2[2]==='buy'){
                            price=V.AX1RL.S2_Beet
                        }else {
                            price=V.AX1RL.S2_BeetM
                        }
                    }

                }

                AddOrder((S, R, D) => {
                        NOB.cycleHistory[x].S2={S:S,R:R,D:D,T:Date.now()}
                        V.sellingData.step2.status='ok'
                        if (S) {
                            try {V.R2=R;V.D2=D}catch (e) {}
                            V.RunSycle2=false;
                            //this.props.set()
                            setTimeout(async() => {
                                V.sellingData.step2.status='done'
                                //await this.props.set()

                                checkStatusDo_Cycle2(V,'',x,isMarket)

                            }, 10)

                        }
                        else {
                            V.sellingData.step2.status='to_retry'
                            V.retryCount2++
                            //this.props.set()
                            setTimeout(() => {

                                if(V.retryCount2>NOB.retryCount){
                                    V.sellingData.step2.status='Canceled'
                                }else {
                                    if (V.RunSycle2) {
                                        S2(2)
                                    }
                                }

                            },delay)
                        }
                    }, A2[2],
                    isMarket?'market':'limit', A2[0], A2[1], RT(Number(use), A2[4]), price,'S2')
            };

            const S3 = async(type=1) => {

                if(type===1){
                    V.sellingData.step3.status='try'
                }
                if(type===2){
                    V.sellingData.step3.status='retry'
                }

                let use
                let price
                if(isMarket){
                    if(V.type==='S'){
                        use=V.AX1.USE3
                    }else {
                        use=V.AX1R.USE3
                    }

                    price=V.SellBuyData3.price
                }
                else {
                    if(V.type==='S'){
                        use=V.AX1L.USE3
                        if(A3[2]==='buy'){
                            price=V.AX1L.S3_Beet
                        }else {
                            price=V.AX1L.S3_BeetM
                        }

                    }else {
                        use=V.AX1RL.USE3
                        if(A3[2]==='buy'){
                            price=V.AX1RL.S1_Beet
                        }else {
                            price=V.AX1RL.S1_BeetM
                        }
                    }

                }

                AddOrder((S, R, D) => {
                        NOB.cycleHistory[x].S3={S:S,R:R,D:D,T:Date.now()}

                        if (S) {
                            try {V.R3=R;V.D3=D}catch (e) {}
                            V.RunSycle3=false;
                            V.sellingData.step3.status='ok'

                            setTimeout(async ()=>{
                                V.sellingData.step3.status='done'

                                checkStatusDo_Cycle2(V,'',x,isMarket)
                            },10)

                        } else {
                            V.sellingData.step3.status='to_retry'
                            V.retryCount3++
                            //this.props.set()
                            setTimeout(() => {
                                if(V.retryCount3>NOB.retryCount){
                                    V.sellingData.step3.status='Canceled'
                                }else {
                                    if (V.RunSycle3) {
                                        S3(2)
                                    }
                                }
                            },delay)
                        }

                    }, A3[2],
                    isMarket?'market':'limit', A3[0], A3[1], RT( Number(use), A3[4]), price,'S3')
            };

            x.IMP.Func.async([
                (C) => {
                    /*if(!NOB.nobSetting.silentSteps){
                        playAlert('glass')
                    }*/
                    V.sellingData.step1.status='start'
                    V.sellingData.step2.status='start'
                    V.sellingData.step3.status='start'
                    V.RunSycle = true;
                    V.RunSycle1 = true;
                    V.RunSycle2 = true;
                    V.RunSycle3 = true;
                    NOB.cycleHistory[x]={}

                    C(true)
                },
                (C) => {

                    let VAX=IND(V)
                    NOB.cycleHistory[x].V={
                        base:VAX.base,
                        type:VAX.type,
                        AX1:VAX.AX1,
                        AX1L:VAX.AX1L,
                        AX1R:VAX.AX1R,
                        AX1RL:VAX.AX1RL,
                        name:VAX.name,
                        sood:VAX.sood,
                    }

                    if(V.type==='S'){
                        try {NOB.cycleHistory[x].Cap=V.AXC[0].IRT/10}catch (e) {}
                        try {NOB.cycleHistory[x].CapPrice=V.AXC[0].sood}catch (e) {}
                    }else {
                        try {NOB.cycleHistory[x].Cap=V.AXC_R[0].IRT/10}catch (e) {}
                        try {NOB.cycleHistory[x].CapPrice=V.AXC_R[0].sood}catch (e) {}
                    }

                    S1(1);
                    S2(1);
                    S3(1);

                    C(true)
                },
            ], 5)

        };

        let NOB_SellCycle=()=>{
            try {
                if( NOB.autoSell){
                    let selling=Object.entries(NOB.NobitexData).filter(([k, vv]) => vv.selling)

                    if(selling.length< NOB.sellInSameTime){

                        let andOrSetting=NOB.andOrSetting

                        let V= Object.entries(NOB.NobitexData)
                            .filter(([k, v]) => {
                                try {
                                    if( (v.status && !v.selling && v.RQTV && v.RSTV && v.OK1 && v.OK2 && v.OK3)){

                                        let DoCount=0
                                        let minCapSell=0
                                        try{
                                            if(v.type==='S'){
                                                minCapSell=v.AXC[0].IRT/10
                                            }
                                            if(v.type==='R'){
                                                minCapSell=v.AXC_R[0].IRT/10
                                            }

                                            andOrSetting.forEach((a)=>{
                                                if(minCapSell>(Number(a.cap[0])*1000000) && minCapSell<=(Number(a.cap[1])*1000000) ){
                                                    if (
                                                        v.sood > (Number(a.minSell) * 1000) &&
                                                        ((momentM().valueOf() - Number(v.sellEndTime)) > (Number(a.time) * 1000))
                                                    ) {
                                                        DoCount++
                                                    }
                                                }

                                            })

                                            // let IsExistSame=false

                                            // if(minCapSell>CapFamilyDo*1000000 && familyDo[v.XX.toLowerCase()]){
                                            //     IsExistSame=true
                                            // }else {
                                            //     try {
                                            //         IsExistSame=Object.entries(selling).find(([k,vv])=> {return vv[1].XX === v.XX;} )===undefined
                                            //     }catch (e) {}
                                            // }

                                            let IsExistSame=Object.entries(selling).find(([k,vv])=> {return vv[1].XX === v.XX;} )===undefined


                                            if(DoCount>0 && IsExistSame){
                                                return  true
                                            }else {
                                                return false
                                            }

                                        }catch (e) {
                                            return false
                                        }

                                    }
                                    else {
                                        return false
                                    }
                                }catch (e) {
                                    return false
                                }
                            })
                            .sort((a, b) => {

                                if (a[1].sood === b[1].sood) {
                                    return 0
                                }
                                if (a[1].sood > b[1].sood) {
                                    return -1
                                }
                                if (a[1].sood < b[1].sood) {
                                    return 1
                                }
                            })[0][1]


                        if(V.base==='IRT'){
                            Do_CycleM(V)
                            /*if(V.type==='S'){
                                // console.log('IRT-S');
                                this.Do_Cycle(V)
                            }
                            if(V.type==='R'){
                                // console.log('IRT-R');
                                this.Do_CycleR(V)
                            }*/
                        }
                        /* if(V.base==='USDT'){
                             if(V.type==='S'){
                                 // console.log('USDT-S');
                                 this.Do_Cycle_S_USDT_BASE(V)
                             }
                             if(V.type==='R'){
                                 // console.log('USDT-R');
                                 this.Do_Cycle_R_USDT_BASE(V)
                             }
                         }
                         if(V.base==='XX'){
                             if(V.type==='S'){
                                 // console.log('USDT-S');
                                 this.Do_Cycle_S_XX_BASE(V)
                             }
                             if(V.type==='R'){
                                 // console.log('USDT-R');
                                 this.Do_Cycle_R_XX_BASE(V)
                             }
                         }*/

                    }

                }

            }catch (e) {}

            setTimeout(()=>{
                NOB_SellCycle()
            },NOB.SellCycleTime)
        }

        NOB_SellCycle()

    }catch (e) {
        let randomString=IMP.randomString
        try {IMP.P.BlocksRuned[X.id].options.ErrorCount++}catch (e) {}
        try {IMP.P.ErrorLogs[`NOB_CheckAll_${Date.now()}_${randomString({length: 5})}`]=e} catch (e) {}
        CB(false)
    }


};



////////////////////////////
// SMALL FUNCTIONS
////////////////////////////

const SmallF_Test1 = (X, IMP, CB = () => {}) => {
    let P = IMP.P
    try {
        CB(true,{test:P.SS.test,testPlus:X.TestNumber+1})
    } catch (e) {
        CB(false)
    }
}