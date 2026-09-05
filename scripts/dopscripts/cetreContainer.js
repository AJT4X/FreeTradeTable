import { SitesInfo, steam_icon_url, TelegramIco  } from "../jsons/jsones_all.js";
import { SteamCurrency,SitesCurrency,ReversCurrency,steam_items_all,jsob_sites_item_all } from "../jsons/jsones_all.js";
import { ActiveGetStorage } from './picSites.js';
import { SetNewCur, SetNewLanguage } from './clickEvent.js';
import { gb_flag,rf_flag} from "../jsons/flags.js";
import { CreateGraph } from './createTableMain.js';
import { trade_link } from "../jsons/dop.js";
import { TranslationBlock } from "../jsons/translate.js";

export function CenterDiv(Element){
    const UpDiv = document.createElement('div');
    UpDiv.id = 'UpDiv';
    const Donate = DonateTrade();
    const gamePeak = GameType();
    Tg();
    Currency();
    Sell_Order();
    FindAllPriceForItemName();
    CreteTf2KeyButton();
    Language();
    ArchiveButton();
    
    function GameType(){
        let UserSetTypeGame = localStorage.getItem('usergameset');
        if(!UserSetTypeGame){
            localStorage.setItem('usergameset',JSON.stringify(['cs2','tf2','rust']));
            UserSetTypeGame = localStorage.getItem('usergameset');
        }
        console.log(UserSetTypeGame);

        let ReturnHtml = document.createElement('div');
        ReturnHtml.classList.add('PeakGame');
        const img = "https://raw.githubusercontent.com/AJT4X/iconSitesTradeProject/refs/heads/main/";
        var GameType = {
            "730" : {
                "gamename" : "cs2",
                "status" : true
            },
            "440" : {
                "gamename" : "tf2",
                "status" : false
            },
            "252490" : {
                "gamename" : "rust",
                "status" : false
            }
        };
        Object.entries(GameType).forEach(([key,value])=>{
            if (!value.status) return;
            const ActiveGameStatus = UserSetTypeGame.includes(value.gamename)? "ActiveGameStatus" : "";
            console.log(ActiveGameStatus);
            ReturnHtml.innerHTML += `<div class='GameDiv'>
                <img class='PeakGameImg ${ActiveGameStatus}' id='${value.gamename}' src='${img}${value.gamename}.ico'>
            </div>`
        });

        return ReturnHtml;
    };
    function ArchiveButton(){
        const LinksD = document.createElement('div');

        LinksD.innerHTML = `
            <a id="GoLinks" class='DonateA' href="/dop_pages/infoTrade/helper.html">Links</a>
        `;
        console.log(LinksD);
        UpDiv.append(LinksD);
    }
    function Sell_Order(){
        const Sell_Order = document.createElement('div');
        let Sell_Order_Storage = localStorage.getItem('SteamPolar');
        if(!Sell_Order_Storage){
            Sell_Order_Storage = 'Offer';
            localStorage.setItem('SteamPolar',Sell_Order_Storage);
        }
        const SteamPolar = Sell_Order_Storage === 'Offer' ? "Offer" : "Order";

        Sell_Order.innerHTML = `<span class='findPic' id='SellOrderStatus'>
        ${SteamPolar}
        </span>
        `;
        UpDiv.append(Sell_Order);
        Sell_Order.addEventListener('click',()=>{
            const SteamPolarRevers = localStorage.getItem('SteamPolar') || "Offer";
            const newSteamPolar = SteamPolarRevers === 'Offer' ? "Order" : "Offer";

            localStorage.setItem('SteamPolar',newSteamPolar);
            const status = Sell_Order.querySelector('#SellOrderStatus');
            if(status){
                status.innerText = newSteamPolar === 'Offer' ? "Offer" : "Order";
            }
        });
    };

    function changeprice(selectedCurrency){
        document.querySelectorAll('[data-dollarprice]').forEach(el=>{
            let rate;
            if(el.id =='imgSteamPic'){
                rate = parseFloat(SteamCurrency[selectedCurrency]);
            }else{
                rate = parseFloat(SteamCurrency[selectedCurrency]);
            }

            const basePrice = parseFloat(el.dataset.dollarprice);
            const convert = basePrice * rate;

            el.innerText = `${convert.toFixed(2)}${ReversCurrency[selectedCurrency]}`;
            el.dataset.price = convert;
                
        });
        return;
    }
    function DonateTrade(){
        const lang = localStorage.getItem('language_user') || "EN";
      
        const DonateTradeDiv = document.createElement('div');
        DonateTradeDiv.classList.add('DonateDiv');
        DonateTradeDiv.innerHTML = `
        <span id='DonateInfo'>${TranslationBlock[lang]['donate'].inf}</span>
        <a class='DonateA'href='${trade_link}' target_='blank'>Steam Trade</a>
        `
        ;
        return DonateTradeDiv;
        
    }


    function Tg(){
        const TelegramGoDiv = document.createElement('a');
        const TelegramGoImg = document.createElement('img');
        TelegramGoDiv.classList.add('TgDiv');
        TelegramGoImg.classList.add('TgPic');
        TelegramGoImg.src = TelegramIco['ico'];
        TelegramGoDiv.href = TelegramIco['link'];
        TelegramGoDiv.target = '_blank';
        TelegramGoDiv.append(TelegramGoImg);
        UpDiv.append(TelegramGoDiv);
    };

    async function Currency(){
        const resutl = localStorage.getItem('currency');
        if (!resutl){
            localStorage.setItem('currency','USD');
        }
        
      
        let currency = resutl || 'USD';
      
        const SelectCurrency = document.createElement('select');
        SelectCurrency.classList.add('SelectPic');
        SelectCurrency.id = 'Currencyid';
        
        Object.entries(SteamCurrency).forEach(([key,value])=>{
            
            const newOpt = document.createElement('option');
            newOpt.innerText = key;
            newOpt.value = key;
            SelectCurrency.append(newOpt);
        });
        SelectCurrency.value = currency;
        UpDiv.append(SelectCurrency);
        SelectCurrency.addEventListener('change',(el)=>{
            const selectedCurrency = el.target.value;
            SetNewCur(selectedCurrency);
            changeprice(selectedCurrency);
        });

    }
    async function FindAllPriceForItemName() {
        const FindDIv= document.createElement('div');
        FindDIv.innerHTML = `<span id='FindDetect' class='findPic'>🔍</span>`;
        UpDiv.append(FindDIv);
    }

    async function CreteTf2KeyButton() {
        const Tf2KeyFind= document.createElement('div');
        Tf2KeyFind.innerHTML = `<img src='https://raw.githubusercontent.com/AJT4X/iconSitesTradeProject/refs/heads/main/tf2key.ico' id='FindTf2Key' class='findPic'></span>`;
        UpDiv.append(Tf2KeyFind);
    }

    function Language(){
        let lang = localStorage.getItem('language_user')
        if (!lang){
            lang = 'EN';
            localStorage.setItem('language_user',lang);
        }
        const flag = lang === 'EN' ? gb_flag : rf_flag;

        const LanguageDiv = document.createElement('div');
        LanguageDiv.innerHTML = `
            <img 
                src="${flag}"
                data-lang="${lang}"
                id ="Language"
                class ="findPic"
            >
        `;
        UpDiv.appendChild(LanguageDiv);
        LanguageDiv.addEventListener('click', () => {

            const currentLang = localStorage.getItem('language_user') || 'EN';
            const newLang = currentLang === 'EN' ? 'RU' : 'EN';

            localStorage.setItem('language_user', newLang);
            SetNewLanguage(newLang);

            const img = document.getElementById('Language');
            img.src = newLang === 'EN' ? gb_flag : rf_flag;

        });

    }
    Element.append(UpDiv,Donate,gamePeak);
    
}

export async function FindTf2Key(){
    document.querySelector('#mainTableDiv_Edit')?.remove();
    document.querySelector("#GrandItemDivFind")?.remove();
    const findClick = document.querySelector("#FindDetect").click();
    const inputValue = document.querySelector('#InputFindItem');
    const BtnFind = document.querySelector('#btnfinditem');

    inputValue.value = 'Mann Co. Supply Crate Key';
    inputValue.dispatchEvent(new Event("input",{bubbles:true}));
    BtnFind.click();
    return;

}

export async function FindDetect(){
    document.querySelector('#mainTableDiv_Edit')?.remove();
    document.querySelector("#GrandItemDivFind")?.remove();

    const GrandDivItemFindDiv = document.createElement('div');
    GrandDivItemFindDiv.id = 'GrandItemDivFind';
    const HelpDivItemFind = document.createElement('div');
    const InputFindItem = document.createElement('input');
    const ButtonFindItem = document.createElement('span');
    
    InputFindItem.id = 'InputFindItem';
    InputFindItem.placeholder = 'AK-47 | ....';
    ButtonFindItem.innerText = '🔍';
    ButtonFindItem.id = 'btnfinditem';
    ButtonFindItem.classList.add('findPic');
    HelpDivItemFind.classList.add('HelpDivCont');

    HelpDivItemFind.append(InputFindItem,ButtonFindItem);
    GrandDivItemFindDiv.append(HelpDivItemFind);
    document.body.append(GrandDivItemFindDiv);
    return;
}
export async function CreateItemFindBlock() {
    document.querySelector('#ItemInfoMainDiv')?.remove();
    const ItemInfoMainDiv =document.createElement('div');
    const ItemInfoDivSteam = document.createElement('div');
    const ItemInfoDivSites = document.createElement('div');
    ItemInfoDivSites.classList.add('ItemInfoDivSites');
    ItemInfoDivSteam.id = 'ItemInfoDivSteam';
    ItemInfoMainDiv.id = 'ItemInfoMainDiv';
    const InputFind = document.querySelector('#InputFindItem');
    const GrandDivForItemFind = document.querySelector('#GrandItemDivFind');
    const currencyNow = ActiveGetStorage('currency');
    const userLanguage = localStorage.getItem('language_user');
    if(!InputFind) return;
    let inputFindValue = InputFind.value;

    if (inputFindValue && GrandDivForItemFind){
        const currency_user = (localStorage.getItem('SteamPolar') || 'Offer').toLowerCase();

        const SteamPrice = steam_items_all[inputFindValue]
        ?steam_items_all[inputFindValue]['dollarPrice'][currency_user]
        :null;

        if(SteamPrice){
            document.querySelector('#ErrorFindItem')?.remove();
            const PicImg = steam_items_all[inputFindValue]['image'];
            
            ItemInfoDivSteam.innerHTML = `
            <img class='PicImg' src="${PicImg}">
            <div class='rowInFindItem'>
            <img class='imgSteamPic' src=${steam_icon_url}>
            <span class='RowInfo ${currency_user == 'order'? "order_blue" : ""}'data-dollarprice='${SteamPrice}' id='imgSteamPic' data-price='${SteamPrice}'>${(SteamPrice*parseFloat(SteamCurrency[currencyNow])).toFixed(2)}${ReversCurrency[currencyNow]}</span>
            </div>
            `;
            Object.entries(jsob_sites_item_all).forEach(([site_name,value])=>{
                const SiteLink = SitesInfo[site_name]['url'];
                const SiteIcon = SitesInfo[site_name]['icon'];

            
                for (const domain in value){
                    if(jsob_sites_item_all[site_name][domain][inputFindValue] 
                        && 
                        jsob_sites_item_all[site_name][domain][inputFindValue]['active'] == 'true'){
                            const item_block = jsob_sites_item_all[site_name][domain][inputFindValue];
                            
                            const price = item_block['price'];
                            let procent = ((price-SteamPrice)/SteamPrice)*100;
                        
                            const ItemFindSitesRowDiv = document.createElement('div');
                            ItemFindSitesRowDiv.classList.add('ItemFindSitesRowDiv');

                            ItemFindSitesRowDiv.innerHTML = `
                            <a style='color:white;text-decoration: none' href='${SiteLink}' target='_blank'>
                            <img class='imgSteamPic ItemFindPicEx' src='${SiteIcon}'>
                            <span>(${(domain[0]).toUpperCase()})</span>
                            </a>
                            <span class='RowInfo' data-dollarprice='${price}' data-price='${price}'>
                            ${(price*SitesCurrency[currencyNow]).toFixed(2)} ${ReversCurrency[currencyNow]}
                            </span>
                            <span id='procent' data-procent=${procent} style='color:${procent>0? 'green': 'red'}'>${procent >0? "+" : ''}${(procent).toFixed(2)}%</span>
                            
                            `;
                            ItemInfoDivSites.append(ItemFindSitesRowDiv);
                    }
                }
            });
            ItemInfoMainDiv.append(ItemInfoDivSteam,ItemInfoDivSites);
            GrandDivForItemFind.append(ItemInfoMainDiv);
        }else{
            document.querySelector('#ErrorFindItem')?.remove();
            const SafeText = escapeHTML(inputFindValue);
            const Error = `<span id='ErrorFindItem'>${SafeText} ${TranslationBlock[userLanguage]['itemFindError']}</span>`;
            
            console.log('error');
            GrandDivForItemFind.innerHTML += Error;
        }   
        
        
    };
    const container = document.querySelector('.ItemInfoDivSites');
    const rows = [...container.querySelectorAll('.ItemFindSitesRowDiv')];
    rows.sort((a,b)=>{
        const pA = parseFloat(
            a.querySelector('#procent')?.dataset.procent || 0
        );
        const pB = parseFloat(
            b.querySelector('#procent')?.dataset.procent || 0
        );
        return pB-pA;
    });
    rows.forEach(row=>container.appendChild(row));
}
function escapeHTML(value){
    return String(value).replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}