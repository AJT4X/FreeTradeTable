document.addEventListener('DOMContentLoaded', async()=>{
    
    const text = await fetch("md/helper_en.md").then(r=>r.text());

    document.querySelector("#content").innerHTML = marked.parse(text);
})