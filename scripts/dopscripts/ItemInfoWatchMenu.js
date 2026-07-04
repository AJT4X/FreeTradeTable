import { SteamCurrency,SitesCurrency,steam_icon_url, SitesInfo,steam_items_all,jsob_sites_item_all,ReversCurrency } from "../jsons/jsones_all.js";
import { TranslationBlock } from "../jsons/translate.js";
import { CreateGraph,overPayCreate } from "../dopscripts/createTableMain.js"

export function CreateMainInfoBlockItem(elemet){
    try{
       
        let resutlAppend = [];
        let currencyUzer = localStorage.getItem('currency') || "USD";
        let userLanguage = localStorage.getItem('language_user') || "EN";
        
        document.querySelector('#MainBlockDivItemShowInfo')?.remove();
        const CentreBlockDiv = document.querySelector('#mainTableDiv_Edit');
        const MainSite = document.querySelector('#SiteName')?.dataset['sitename'];
        const DomainMain = document.querySelector('#SiteName')?.dataset['domain'];
        const rowDiv = elemet.target.closest('.rowDiv');
        const ItemName = rowDiv.querySelector('[data-name]').dataset.name;
        const gameid =  rowDiv.querySelector('[data-gameid]').dataset.gameid;
        const SteamPrice =  steam_items_all[ItemName]['dollarPrice'].offer;
        const SteamOrder = steam_items_all[ItemName]['dollarPrice'].order;
        const SitePrice = jsob_sites_item_all[MainSite][DomainMain][ItemName]['price'];
        const SiteUrl = SitesInfo[MainSite].url;
        const float = jsob_sites_item_all[MainSite][DomainMain][ItemName]['float'] ?? 0;
        const charmpattern = jsob_sites_item_all[MainSite][DomainMain][ItemName]['charmpattern'] ?? 0;
        const ItemIcon = steam_items_all[ItemName]['image'];
        
        var ProcentOffer = ((parseFloat(SitePrice) - parseFloat(SteamPrice))/parseFloat(SteamPrice))*100;
        var ProcentOrder = ((parseFloat(SitePrice) - parseFloat(SteamOrder))/parseFloat(SteamOrder))*100;
        var maxBotGetItem =jsob_sites_item_all[MainSite][DomainMain][ItemName]?.maxBotGetItem || 0;
       
        const MainBlockDivItemShowInfo = document.createElement('div');
        const exitButton = document.createElement('button');

        exitButton.innerText = 'X';
        exitButton.id = 'ExitButtonItemInfo';
        MainBlockDivItemShowInfo.id = 'MainBlockDivItemShowInfo';
        resutlAppend.push(exitButton);
        HeadBlock({itemName: ItemName});
        MainBlockItemView({
            itemName: ItemName,
            pricedollar_offer:steam_items_all[ItemName]['dollarPrice']['offer'],
            pricedollar_order:steam_items_all[ItemName]['dollarPrice']['order'],
            steam_cur: SteamCurrency[currencyUzer],
            site_cur: SitesCurrency[currencyUzer],
            SitePrice,
            sitename : MainSite,
            dommain: DomainMain,
            procentoffer: ProcentOffer,
            procentorder: ProcentOrder,
            float,
            userLanguage,
            gameid,
            charmpattern
        
        });
        
        
        resutlAppend.forEach(el=>{
            MainBlockDivItemShowInfo.append(el);
        });
        
        CentreBlockDiv.append(MainBlockDivItemShowInfo);

        function HeadBlock(info){
            const HeadBlockDiv = document.createElement('div');
            HeadBlockDiv.innerHTML = `
                    <span id='ItemInRow' data-name='${info.itemName}'>${info.itemName}</span>
                `
            resutlAppend.push(HeadBlockDiv);
            return;
        }
        function Image(info){
            return `
                <img src='${info.image}' class='PicImgBigView' id='ItemImageBigView'>
            `;
            
        }
        function rightDiv(){
            const BodyDiv = document.querySelector('#BodyDivInfo');
            const RightDiv = document.createElement('div');
            
            return `
                ${maxBotGetItem > 0 ? `
                <div>
                    <span class='MaxBotGetItemInfo'>
                    🤖 
                        ${TranslationBlock[userLanguage]['bot']} 
                        ${maxBotGetItem} 
                        ${userLanguage === 'EN' ? 'items' : 'шт.'}
                    </span>
                </div>
                ` : ''}
            `;
            
        };
        function MainBlockItemView(info){
            try{
               
                const PricesDivItemInfoBigView = document.createElement('div');
                PricesDivItemInfoBigView.id = 'BodyDivInfo';
                const steamMarketUrl = `https://steamcommunity.com/market/listings/${info.gameid}/${encodeURIComponent(info.itemName)}`
                PricesDivItemInfoBigView.innerHTML = `
                    <div id='ImageItemAndPricesLeftDiv'>
                        ${Image({itemName:ItemName,image:ItemIcon})}
                        <div id='Prices'>
                            <div id='SteamDivItemBigView'>
                                <a class='a_nowview' href=${steamMarketUrl} target="_blank">
                                    <img class='imgSteamPic ItemFindPicEx'src='${steam_icon_url}'>
                                </a>
                                <div class='SteamDivPriceAndProcnet'>
                                    <span title='Offer'class='PriceItemInRowBigView' data-pricedollar='${info.pricedollar_offer}' data-price='${info.pricedollar_offer*info.steam_cur}'>${(info.pricedollar_offer*info.steam_cur).toFixed(2)} ${ReversCurrency[currencyUzer]}</span>
                                    <span title='Order' class='order_blue PriceItemInRowBigView' data-pricedollar='${info.pricedollar_order}' data-price='${info.pricedollar_order*info.steam_cur}'>${(info.pricedollar_order*info.steam_cur).toFixed(2)} ${ReversCurrency[currencyUzer]}</span>
                                </div>
                            </div>
                            <div id='SteamDivItemBigView'>
                                <a class='a_nowview' id='SiteDivItemBigView' href=${SitesInfo[info.sitename]['url']} target='_blank'>
                                    <img class = 'imgSteamPic ItemFindPicEx'src='${SitesInfo[info.sitename]['icon']}'>
                                </a>
                                <span title='Site price' class='PriceItemInRowBigView' data-pricedollar='${info.SitePrice}' data-price='${info.SitePrice*SitesCurrency[info.site_cur]}'>
                                ${(info.site_cur * info.SitePrice).toFixed(2)} ${ReversCurrency[currencyUzer]}
                                </span>
                            </div>
                            <div id='SteamDivItemBigView' class='Procent'>
                                <span>%: </span>
                                <div class='SteamDivPriceAndProcnet'>
                                <span style='color:${info.procentoffer < 0? "red" : "green"}' title='Offer'class='PriceItemInRowBigView'>${info.procentoffer >0? "+" : ''}${(info.procentoffer).toFixed(2)}%</span>
                                <span title='Order'class='order_blue PriceItemInRowBigView'>${info.procentorder >0? "+" : ''}${(info.procentorder).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>    
                </div>
                <div id='RightDivBigOverview'>
                    ${rightDiv()}
                    ${jsob_sites_item_all[MainSite][DomainMain][ItemName]?.overpay 
                        ?`
                        <div id='overpayBigView'>
                            <span style='color:white'>${TranslationBlock[userLanguage]['overpay']}</span>
                            ${overPayCreate({
                                itemName : ItemName,siteName:MainSite,Domain:DomainMain

                            })}
                        
                        </div>` 
                        
                        : ""}

                        <div id='History'>

                        </div>
                        ${info['float']? `<div id='float'>
                            <span class='floatView'>
                            Float:
                            ${(info['float']).toFixed(4)}
                            </span>
                            
                            </div>` : ""}
                        ${info['charmpattern']? `<div id='float'>
                            <span class='floatView'>
                            Pattern:
                            ${(info['charmpattern'])}
                            </span>
                            
                            </div>` : ""}

                </div>
                `;

                
                resutlAppend.push(PricesDivItemInfoBigView);
                        }catch(e){
                            console.log(e);
                        }
        };

        CreateGraph(ItemName);
}catch(e){
    console.log(e);
}
}