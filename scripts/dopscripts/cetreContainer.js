import { SitesInfo, steam_icon_url, TelegramIco  } from "../jsons/jsones_all.js";
import { SteamCurrency,SitesCurrency,ReversCurrency,steam_items_all,jsob_sites_item_all } from "../jsons/jsones_all.js";
import { ActiveGetStorage } from './picSites.js';
import { SetNewCur } from './clickEvent.js';
import { CreateGraph } from './createTableMain.js';
export function CenterDiv(Element){
    Tg();
    Currency();
    FindAllPriceForItemName();
    function changeprice(selectedCurrency){
        // const CheckTable = document.querySelector('.RowContanerDiv');
        // if(!CheckTable) return;
        document.querySelectorAll('[data-dollarprice]').forEach(el=>{
            if(el.id =='imgSteamPic'){
                el.innerText = `${(parseFloat(el.dataset.dollarprice)*parseFloat(SteamCurrency[selectedCurrency])).toFixed(2)}${ReversCurrency[selectedCurrency]}`;
            }
                el.innerText = `${(parseFloat(el.dataset.dollarprice)*parseFloat(SitesCurrency[selectedCurrency])).toFixed(2)}${ReversCurrency[selectedCurrency]}`;
        });
        
        return;
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
        Element.append(TelegramGoDiv);
    }
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
        Element.append(SelectCurrency);
        SelectCurrency.addEventListener('change',(el)=>{
            const selectedCurrency = el.target.value;
            SetNewCur(selectedCurrency);
            changeprice(selectedCurrency);
        });

    }
    async function FindAllPriceForItemName() {
        const FindDIv= document.createElement('div');
        FindDIv.innerHTML = `<span id='FindDetect' class='findPic'>🔍</span>`;
        Element.append(FindDIv);
    }
    
    
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
    
    if(!InputFind) return;
    let inputFindValue = InputFind.value;

    if (inputFindValue && GrandDivForItemFind){
       
        const SteamPrice = steam_items_all[inputFindValue]['dollarPrice'];

        const PicImg = steam_items_all[inputFindValue]['image'];
       
        ItemInfoDivSteam.innerHTML = `
        <img class='PicImg' src="${PicImg}">
        <div class='rowInFindItem'>
        <img class='imgSteamPic' src=${steam_icon_url}>
        <span class='RowInfo'data-dollarprice='${SteamPrice}' id='imgSteamPic' data-price='${SteamPrice}'>${(SteamPrice*parseFloat(SteamCurrency[currencyNow])).toFixed(2)}${ReversCurrency[currencyNow]}</span>
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
                        <span style='color:${procent>0? 'green': 'red'}'>${procent >0? "+" : ''}${(procent).toFixed(2)}%</span>
                        
                        `;
                        ItemInfoDivSites.append(ItemFindSitesRowDiv);
                }
            }
        });
        
        ItemInfoMainDiv.append(ItemInfoDivSteam,ItemInfoDivSites);
        GrandDivForItemFind.append(ItemInfoMainDiv);
    }
}