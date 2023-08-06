const handleOpen = () => {
  const hiddenInfoWrap = document.querySelector("#hidden-info-wrap");
  const hiddenInfoArrow = document.querySelector("#hiiden-info-arrow");
  hiddenInfoWrap.classList.toggle("max-h-72");
  hiddenInfoWrap.classList.toggle("max-h-2000");
  hiddenInfoArrow.classList.toggle("rotate-180");
};

class DisclosureBlock extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div id="hidden-info-wrap"
    class="bg-black text-light-sand rounded-md lg:mt-16 transition-all duration-300 max-h-72 overflow-hidden">
    <div id="hidden-info-opener" class="flex justify-between cursor-pointer p-6">
    <span class="text-inherit flex gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none">
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#FCF7E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 8V12" stroke="#FCF7E6" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            <path d="M12 16H12.01" stroke="#FCF7E6" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
        ALPHA
    </span>
    <span class="md:ml-16 md:mr-auto">
        Important info <span class="hidden lg:inline">regarding our service</span>
    </span>
    <svg id="hiiden-info-arrow" class="transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 9L12 15L18 9" stroke="#FCF7E6" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
   </div>
   <p class="p-6">
   ${this.innerText}
   </p>
   </div>
   `;
    this.addEventListener("click", handleOpen);
  }
}

customElements.define("disclosure-block", DisclosureBlock);
