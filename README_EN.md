<h1>UXN (1.0 Beta) - Documentation</h1>

<p>UXN allows you to create user-friendly navigations. It tracks, if the mouse is moving to any menu, and if so, then the menu stays opened. As a result, the user need not to browse through the navigation like a robot and be moving the mouse at right angles (see the animation below).</p>

<p>The second function of UXN is adjusting positions of submenus into the browser window (page or element).</p>

<p>UXN works exclusively on the basis of classes (<code>class</code> attribute) and thus it doesn't modify the <code>style</code> attribute of elements. All class names can be changed however you want.</p>

<p>UXN uses native methods and APIs (<code>closest</code>, <code>matches</code>, <code>classList</code>, ...), if they are available to ensure maximum efficiency.</p>

<figure><img src="uxn-demo.gif" alt="UXN"></figure>

<h2>Dependencies</h2>

<p><strong>jQuery</strong> - tested with version 1.11.3</p>

<h2>Browsers support</h2>

<p>All browsers supported by jQuery. Although older browsers (IE7 and lower) can be too slow.</p>

<h2>Basic usage</h2>

<h3>JavaScript</h3>

<pre>var mainNav = new UXN("#main-nav");

//or
var mainNav = new UXN({
    nav: "#main-nav",
    itemOpened: "custom-opened-class"
});</pre>

<p>The default selectors for the submenus and items are <code>ul</code> and <code>li</code>. These can be changed by <code>subnav</code> and <code>item</code> properties. It's important that these selctors do not select any other elements than elements of a submenu or an item.</p>

<p>Note: Do not use selectors like <code>#main-nav .subnav</code>, but only <code>.subnav</code>.</p>

<p>Note: <code>nav</code> selector does not have to be an <code>id</code>, but must be unique.</p>

<p>Note: The default value of the <code>nav</code> property is <code>#main-nav</code>. So if your navigation has the <code>id</code> <code>#main-nav</code>, you can use just <code>new UXN();</code>.</p>

<h3>HTML</h3>

<p>Basic navigation:</p>

<pre>&lt;nav id=&quot;main-nav&quot;&gt;  
    &lt;ul&gt;
        &lt;li&gt;
            &lt;a href=&quot;#&quot;&gt;link&lt;/a&gt;  
            &lt;ul&gt;
                &lt;li&gt;...&lt;/li&gt;
                ...
            &lt;/ul&gt;  
        &lt;/li&gt;
        ...
    &lt;/ul&gt;  
&lt;/nav&gt;</pre>

<p>On touch devices may be suitable to use a dedicated opening element (see demo <a href="http://michaljerabek.github.io/UXN#3">#3</a>), if we want to be able to use item's link and be able to open a submenu inside the item. The HTML could look like this:</p>

<pre>&lt;nav id=&quot;main-nav&quot;&gt;  
    &lt;ul&gt;
        &lt;li&gt;
            &lt;a href=&quot;#&quot;&gt;link&lt;/a&gt;  
            &lt;div class=&quot;opener&quot;&gt;
                &lt;span&gt;&rarr;&lt;/span&gt;  
                &lt;ul&gt;
                    &lt;li&gt;...&lt;/li&gt;
                    ...
                &lt;/ul&gt;  
            &lt;/div&gt;  
        &lt;/li&gt;
        ...
    &lt;/ul&gt;  
&lt;/nav&gt;</pre>

<p>Note: Selector for opening elements can be set by <code>opener</code> property.</p>

<p>Note: Last submenus do not have to have any item (see demo <a href="http://michaljerabek.github.io/UXN#4">#4</a>, <a href="http://michaljerabek.github.io/UXN#6">#6</a>, <a href="http://michaljerabek.github.io/UXN#7">#7</a>).</p>

<h3>CSS</h3>

<pre>#main-nav li {
    position: relative;
    ...
}

#main-nav ul ul {
    position: absolute;
    top: 0px;
    left: 100%;
    
    display: none;
    ...
}        

#main-nav li.UXN__item--opened &gt; ul {
    display: block;
}        

#main-nav li.UXN__item--highlighted {
    background-color: red;
    ...
}        
</pre>

<h4>Použití s CSS Tranistions:</h4>

<pre>#main-nav li {
    position: relative;

    overflow: hidden;
    ...
}

#main-nav ul ul {
    position: absolute;
    top: 0px;
    left: 100%;
    
    opacity: 0;
    visibility: hidden;
    
    transition: 
    opacity    0.2s ease-in 0s, 
    visibility 0s           0.2s;
    ...
}        

#main-nav li.UXN__item--has-fading-out,
#main-nav li.UXN__item--opened {
    overflow: visible;
}        

#main-nav li.UXN__item--opened {
    background-color: red;
}        

#main-nav li.UXN__item--opened &gt; ul {
    opacity: 1;
    visibility: visible;
    
    transition: opacity 0.2s ease-out;
}        
</pre>

<p>For more, see the <a href="http://michaljerabek.github.io/UXN#2">demo</a>.</p>

<h2>Třídy používané k procházení navigace</h2>

<h3>Inicializace a aktivace</h3>

<ul>
    <li>
        <code>UXN__item--has-subnav</code> (<code>itemHasSubnav</code>):
        <br> - Všechny položky, které obsahují podnabídku.
    </li>

    <li>
        <code>UXN__opener--has-subnav</code> (<code>openerHasSubnav</code>):
        <br> - Otevírací element obsahující podnabídku.
    </li>

    <li>
        <code>UXN</code> (<code>instance</code>):
        <br> - Element, který je instancí UXN (nastavený vlastností <code>nav</code>). (Lze použít např. pro vytvoření fallbacku, pokud má uživatel vypnutý JS.)
    </li>

    <li>
        <code>UXN--active</code> (<code>activeInstance</code>):
        <br> - Získá element specifikovaný v <code>nav</code>, pokud uživatel prochází nabídku.
    </li>
</ul>

<h3>Otevření podnabídky</h3>

<ul>
    <li>
        <code>UXN__item--opened</code> (<code>itemOpened</code>):
        <br> - Položka s otevřenou nabídkou. Tato třída by neměla sloužit k nastavení vzhledu a měla by zajišťovat pouze otevření podnabídky. (Pro nastavení vzhledu slouží třída <code>UXN__item--highlighted</code>.)
    </li>

    <li>
        <code>UXN__opener--opened</code> (<code>openerOpened</code>):
        <br> - Otevírací element s otevřenou nabídkou. Tato třída by neměla sloužit k nastavení vzhledu a měla by zajišťovat pouze otevření podnabídky. (Pro nastavení vzhledu slouží třída <code>UXN__opener--highlighted</code>.)
    </li>

    <li>
        <code>UXN__item--highlighted</code> (<code>itemHighlighted</code>):
        <br> - Položka s otevřenou nabídkou.
    </li>

    <li>
        <code>UXN__opener--highlighted</code> (<code>openerHighlighted</code>):
        <br> - Otevírací element s otevřenou nabídkou.
    </li>

    <li>
        <code>UXN__subnav--has-opened</code> (<code>subnavHasOpened</code>):
        <br> - Nabídka s otevřenou položkou.
    </li>

    <li>
        <code>UXN__subnav--current</code> (<code>currentSubnav</code>):
        <br> - Nabídka, nad kterou se nachází kurzor (nebo se naposledy nacházel).
    </li>
</ul>

<h3>Zavření podnabídky</h3>

<ul>

    <li>
        <code>UXN__item--has-fading-out</code> (<code>itemHasFadingOut</code>):
        <br> - Položka, jejíž podnabídka se zavírá. (Pouze v případě použítí <code>fading</code>.)
    </li>

    <li>
        <code>UXN__opener--has-fading-out</code> (<code>openerHasFadingOut</code>):
        <br> - Otevírací element, jehož podnabídka se zavírá. (Pouze v případě použítí <code>fading</code>.)
    </li>

    <li>
        <code>UXN__subnav--has-fading-out</code> (<code>subnavHasFadingOut</code>):
        <br> - Nabídka, která obsahuje položku, jejíž podnabídka se zavírá. (Pouze v případě použítí <code>fading</code>.)
    </li>

    <li>
        <code>UXN-no-fading</code> (<code>noFading</code>):
        <br> - Nabídka, která nepoužívá přechody (transitions) ani animace. V případě, že některé nabídky používají přechody nebo animace k jejich zavření a některé ne, je potřeba určit, u kterých nabídek se nemá očekávat událost <code>transitionend</code> / <code>animationend</code>.
    </li>

    <li>
        <code>UXN-sliding--vertical</code> (<code>slidingVertical</code>):
        <br> - Umožňuje vlastní řízení otevírání nabídek. V případě, že má nabídka třídu <code>UXN-sliding--vertical</code>, podnabídka se otevře bez nutnosti zastavení myši, pokud se kurzor pohybuje vertikálně.
    </li>

    <li>
        <code>UXN-sliding--horizontal</code> (<code>slidingHorizontal</code>):
        <br> - Umožňuje vlastní řízení otevírání nabídek. V případě, že má nabídka třídu <code>UXN-sliding--horizontal</code>, podnabídka se otevře bez nutnosti zastavení myši, pokud se kurzor pohybuje horizontálně.
    </li>
</ul>

<p>Třídy obsahující "fading" jsou důležité pro správnou funkčnost CSS Transitions. Slouží zejména k nastavení daného elementu na <code>overflow: visible;</code>, aby nebyl element skrytý.</p>

<h3>Ostatní</h3>

<ul>

    <li>
        <code>UXN-exclude</code> (<code>exclude</code>):
        <br> - Nabídka, která se má vyřadit ze sledování pohybu myši.
    </li>

    <li>
        <code>UXN-exclude--inside</code> (<code>excludeInside</code>):
        <br> - Nabídka, která se má vyřadit ze sledování pohybu myši, pokud se kurzor nachází uvnitř nabídky. (Viz demo <a href="http://michaljerabek.github.io/UXN#6">#6</a>.)
        <br> - Užitečné pouze v případě, že <code>hideFollowing</code> je <code>false</code>.
    </li>

    <li>
        <code>UXN-horizontal</code> (<code>horizontal</code>):
        <br> - Nabídka, která je horizontální (položky jsou za sebou). (Důležité pokud je <code>allowSliding</code> <code>true</code>. Vice <a href="#allowSliding">zde</a>.)
    </li>
</ul>

<h2>Třídy pužívané pro nastavování pozic</h2>

<p>Základní postup je následující:</p>

<ol>
    <li>Nastylujete navigaci do výchozího směru. (Například se nabídky budou otevírat směrem dolu doprava.)</li>
    <li>Nastylujete třídy, které směřují opačným směrem. (Například <code>UXN__subnav--top</code> a <code>UXN__subnav--left</code>.)</li>
</ol>

<p>Pokud se nabídka vejde do okna (stránky, elementu) a tedy její pozice se nemění, tak nedostane žádnou třídu s vyjímkou případu, kdy používáte pozicování navigace od středu okna (stránky, elementu). Více <a href="#firstLevelPositionsFromCenter">zde</a>.</p>

<p>Pozice se může nastavovat podle okna, stránky nebo elementu. V případě nastavení podle stránky se nabídka obrátí, pokud by přesáhla <code>&lt;html&gt;</code>. Je-li <code>&lt;html&gt;</code> menší jak viewport, použije se velikost viewportu. Nevejde-li se nabídka ani opačným směrem, pak je upřednostňován směr dolu doprava.</p>

<p>První úroveň nabídek se může určovat podle jiného elementu než ostatní nabídky. V takovém případě se nastaví vlastnost <code>firstLevelPositionsFromCenter</code> na <code>true</code>, není-li vlastnost explicitně nastavena na <code>false</code>. Ostatní nabídky pak budou pokračovat v nastaveném směru.</p>

<p>Nastavení podle čeho se určí pozice:</p>

<pre>var mainNav = new UXN({
    nav: "#main-nav",
    positionBase: UXN.POSITION_BASE.PAGE // UXN.POSITION_BASE.WINDOW // $("#wrapper") // document.getElementById("wrapper")
});</pre>

<p>Třídy:</p>

<ul>

    <li>
        <code>UXN-position--skip</code> (<code>positionSkip</code>):
        <br> - Může být nastaveno podnabíkám, u kterých se nemají pozice nastavovat. Typicky první úroveň podnabídek. (Může být nastaveno pomocí <code>positionSkipOnFirstLevel: true</code>, potom není nutné přidávat třídy.)
    </li>

    <li>
        <code>UXN__subnav--left</code> (<code>subnavLeft</code>) |
        <code>UXN__subnav--right</code> (<code>subnavRight</code>) |
        <code>UXN__subnav--top</code> (<code>subnavTop</code>) |
        <code>UXN__subnav--bottom</code> (<code>subnavBottom</code>):
        <br> - Nabídka, která by měla být otočena příslušným směrem.
    </li>

    <li>
        <code>UXN__item--has--left</code> (<code>itemHasLeft</code>) |
        <code>UXN__item--has--right</code> (<code>itemHasRight</code>) |
        <code>UXN__item--has--top</code> (<code>itemHasTop</code>) |
        <code>UXN__item--has--bottom</code> (<code>itemHasBottom</code>):
        <br> - Položka s nabídkou nastavenou na příslušné pozici.
    </li>

    <li>
        <code>UXN__opener--has--left</code> (<code>openerHasLeft</code>) |
        <code>UXN__opener--has--right</code> (<code>openerHasRight</code>) |
        <code>UXN__opener--has--top</code> (<code>openerHasTop</code>) |
        <code>UXN__opener--has--bottom</code> (<code>openerHasBottom</code>):
        <br> - Otevírací element s nabídkou nastavenou na příslušné pozici.
    </li>
</ul>

<p>Upozornění: Nastavování pozic způsobuje spoždění před otevřením nabídek. Některé prohlížeče (nechci jmenovat&hellip; &hellip;IE) se navíc mohou na chvíli zablokovat.</p>

<h2>Nastavení</h2>

<p>Pro nastavení vlastních tříd viz výše.</p>

<p>Nastavení lze za běhu aplikace nastavit pomocí <code>[objectUXN].opt</code>. Neměňte ale selektory a názvy tříd.</p>

<ul>

    <li>
        <code>nav</code> (výchozí: <code>"#main-nav"</code>):
        <br> - Selektor elementu obalující navigaci. (Musí být unikátní pro celý dokument.)
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>item</code> (výchozí: <code>"li"</code>):
        <br> - Selektor položek navigace. (Uvnitř navigace nesmí vybírat nic jiného než položky.)
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>subnav</code> (výchozí: <code>"ul"</code>):
        <br> - Selektor nabídek navigace včetně první úrovně. (Uvnitř navigace nesmí vybírat nic jiného než nabídky.)
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>opener</code> (výchozí: hodnota z <code>item</code>):
        <br> - Selector pro otevírací element. (Uvnitř navigace nesmí vybírat nic jiného než otevírací element.)
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>closer</code> (výchozí: <code>"a"</code>):
        <br> - Selector pro element, který po kliknutí navigace zavře.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>autoSleep</code> (výchozí: <code>true</code>):
        <br> - Navigace přestane reagovat na události, pokud se nachází mimo okno prohlížeče (nebo je unitř elementu s <code>display: none</code>). - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>fading</code> (výchozí: <code>UXN.FADING_TYPE.NONE</code>):
        <br> - Nastavuje, jestli nabídky používají CSS Transitions, CSS Animations nebo javascriptové animace.
        <br> - Možnosti: <code>UXN.FADING_TYPE.TRANSITION</code> |
        <code>UXN.FADING_TYPE.ANIMATION</code> |
        <code>UXN.FADING_TYPE.JS</code> |
        <code>UXN.FADING_TYPE.NONE</code>
        <br> - Typ: <code>UXN.FADING_TYPE</code>
    </li>

    <li>
        <code>animation</code> (výchozí: <code>"UXN-hide"</code>):
        <br> - Název animace (nebo pole názvů), která zavírá nabídku.
        <br> - Typ: <code>String</code> / <code>Array</code>
    </li>

    <li>
        <code>delayHide</code> (výchozí: <code>false</code>):
        <br> - Nastavuje, jestli se má otevřená nabídka schovat okamžitě po odjetí z položky nebo až těsně před tím, než se otevře další (popř. se myš zastaví na dobu určenou v <code>openTimeout</code>).
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>autoHide</code> (výchozí: <code>true</code>):
        <br> - Nastavuje, jestli se v případě, že kurzor zastaví mimo nabídku, má navigace automaticky zavřít po uplynutí <code>outsideTimeout</code>.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>closeOnlyInLevel</code> (výchozí: <code>false</code>):
        <br> - Zavírá pouze nabídky na úrovni, na které jsou přepnuty. To umožňuje zachovat poslední otevřenou podnabídku. Viz demo <a href="http://michaljerabek.github.io/UXN#6">#6</a>.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>doNotCloseFirstLevel</code> (výchozí: <code>false</code>):
        <br> - Nabídka na první úrovni zůstane vždy otevřena. Při inicializaci je možné první nabídku otevřít při spuštění <code>onInit</code> metodou <code>open</code>. - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>hideFollowing</code> (výchozí: <code>true</code>):
        <br> - Nastavuje, jestli se mají zavřít nabídky následující po nabídce, nad kterou se nachází kurzor a neuplynul čas <code>insideTimeout</code>. Při nastavení delšího času <code>insideTimeout</code> a <code>hideFollowing</code> na <code>false</code> je možné se vrátit v nabídce zpět, pokud si uživatel uvědomí, že správná volba se nachází v již otevřené nabídce, ale už se přesunul zpět do jiné.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>keepOpened</code> (výchozí: <code>true</code>):
        <br> - Poslední otevřená nabídka zůstane otevřená i pokud se kurzor nachází mimo položku uvnitř rodičovské nabídky.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>excludeFirstLevel</code> (výchozí: <code>true</code>):
        <br> - Vyřadí první úroveň navigace ze sledování kurzoru. - Typ: <code>Boolean</code>
    </li>

    <li id="allowSliding">
        <code>allowSliding</code> (výchozí: <code>true</code>):
        <br> - Nastavuje, jestli se uživatel musí nad nabídkou zastavit po dobu <code>openTimeout</code>, než se nabídka otevře. V případě, že není nastaveno <code>ignoreLayoutOnSliding</code> na <code>true</code>, je potřeba u horizontálních nabídek přidat třídu specifikovanou v <code>horizontal</code>.
        <br> - Pokud používáte nastavování pozic, pak stejně dojde k určitému spoždění.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>allowSlidingOnFirstLevel</code> (výchozí: <code>false</code>):
        <br> - Určuje, jestli <code>allowSliding</code> platí i pro první úroveň navigace.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>ignoreLayoutOnSliding</code> (výchozí: <code>false</code>):
        <br> - Určuje, jestli se při spoždění otevírání má brát v úvahu rozložení nabídky. V případě, že jsou odkazy pod sebou (nabídka je vertikální), pak se otevírání bude spožďovat pouze pokud se kurzor pohybuje ve vertikálním směru. Pro detailnější natavení viz <code>slidingZone</code>.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>slidingZone</code> (výchozí: <code>75</code>):
        <br> - Nastavuje procentuální velikost zóny (od strany vzálenější od kurzoru), ve které se nebude otevírání nabídky spožďovat, pokud se myš pohybuje v opačném směru než je rozložení nabídky. (Je-li nabídka vertikální a myš se pohybuje horizontálně v této zóně, otevření se nespozdí.)
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>openTimeout</code> (výchozí: <code>30</code>):
        <br> - Určuje dobu, na kterou musí uživatel zastavit myš nad položkou, aby se otevřela.
        <br> - Pokud používáte nastavování pozic, pak se spoždění o něco prodlouží.
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>preventClickOnTouch</code> (výchozí: <code>true</code>):
        <br> - Nastavuje, jestli se má po tapnutí (<code>"ontouchend"</code>) na položku, která má podnabídku a nemá otevírací element, zablokovat události kliknutí. (<code>"onclick"</code>)
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>closeOnClick</code> (výchozí: <code>false</code>):
        <br> - Nastavuje, jestli se má po kliknutí (kamkoliv) nabídka zavřít nebo zůstat otevřená.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>mouseTolerance</code> (výchozí: <code>1</code>):
        <br> - Počet pixelů před kurzorem ve směru jeho pohybu, které mají být brány v úvahu při testování, jestli uživatel směřuje k nabídce. (Pokud je nabídka například vysoká a položky, které ji otevírají úzké, může být lepší toleranci nastavit na <code>0</code>.)
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>minZoneExt</code> (výchozí: <code>25</code>):
        <br> - Nastavuje minimální rozšíření oblasti, která je považovaná za směřování k nabídce. (Míra rozšíření se zvětšuje s rostoucí vzdáleností myši od nabídky. Pro ukázku viz <a href="http://michaljerabek.github.io/UXN#2">demo</a> se zapnutým debug módem.)
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>maxZoneExt</code> (výchozí: <code>250</code>):
        <br> - Nastavuje maximální rozšíření oblasti, která je považovaná za směřování k nabídce. (Míra rozšíření se zvětšuje s rostoucí vzdáleností myši od nabídky. Pro ukázku viz <a href="http://michaljerabek.github.io/UXN#2">demo</a> se zapnutým debug módem.)
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>zoneExtOffset</code> (výchozí: <code>0</code>):
        <br> - Nastavuje fixní rozšíření (zúžení) oblasti, která je považovaná za směřování k nabídce. (Hodnota se přičte k celkovému výsledku.)
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>surroundingZone</code> (výchozí: <code>15</code>):
        <br> - Velikost oblasti kolem nabídky, na kterou může uživatel najet, ikdyž kurzorem směřuje od nabídky. Navigace se zavře za čas nastavený v <code>surroundingTimeout</code>.
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>insideTimeout</code> (výchozí: <code>30</code> a více - podle prohlížeče):
        <br> - Doba, za kterou se nabídka zavře, pokud uživatel nepohybuje myší směrem k ní, pokud se nachází uvnitř navigace.
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>outsideTimeout</code> (výchozí: <code>400</code>):
        <br> - Doba, za kterou se navigace zavře, pokud uživatel nepohybuje myší směrem k nabídce, pokud se nachází mimo navigaci.
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>surroundingTimeout</code> (výchozí: <code>600</code>):
        <br> - Po uplynutí zadané doby, pokud je myš mimo zónu považovanou za směřující k nabíce a zároveň uvnitř <code>surroundingZone</code>, se navigace zavře.
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>isFadedOut</code>:
        <br> - Funkce pro zjištění, jestli je nabídka uzavřená. Důležité pro správné fungování CSS Transitions. Výchozí funkce zjišťuje, jestli došlo k ukončení přechodu u vlastnosti <code>visibility</code>.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>jQuery</code> - element nabídky</li>
            <li><code>TransitionEvent</code></li>
            <li><code>Function</code> - callback oznamující zavření nabídky, který může být zavolán později.</li>
        </ul>
        - Funkce musí vrátit <code>false</code>, pokud nedošlo k uzavření nabídky. V případě, že ano, pak <code>true</code>.
        <br> - Při používání přechodů výrazně doporučuji používat vzor použitý výše (nabídka se zobrazuje/skrývá pomocí <code>visibility</code>, která je nastavená i v <code>transition</code> se spožděním, a třída <code>UXN__item--opened</code> odstraňuje <code>visibility</code> z <code>transition</code>.), protože <code>TransitionEvent</code> při rychlém přepínání nemusí nastat (v případě <code>visibility</code> ale funguje pokaždé) nebo se může zachytit ještě předcházející událost. - Typ: <code>Function &lt;= boolean</code>
    </li>

    <li>
        <code>onInit</code> (výchozí: <code>null</code>):
        <br> - Funkce se zavolá na konci inicializace.
        <br> - Typ: <code>Function</code>
    </li>

    <li>
        <code>onSubnavChange</code> (výchozí: <code>null</code>):
        <br> - Funkce se zavolá při přejetí na jinou nabídku.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>jQuery</code> - element aktuální nabídky</li>
        </ul>

        - Typ: <code>Function</code>
    </li>

    <li>
        <code>onOpen</code> (výchozí: <code>null</code>):
        <br> - Funkce se zavolá před otevřením nabídky. V případě, že funkce vrátí <code>false</code>, nabídka se neotevře. Funkce může být použita pro JavaScriptové animace.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>jQuery</code> - element nabídky</li>
            <li><code>jQuery</code> - element položky.</li>
            <li><code>jQuery</code> - element otevíracího prvku</li>
        </ul>

        - Typ: <code>Function [&lt;= boolean]</code>
    </li>

    <li>
        <code>onClose</code> (výchozí: <code>null</code>):
        <br> - Funkce se zavolá před zavřením nabídky. V případě, že funkce vrátí <code>false</code>, nabídka se nezavře.
        <br> - Funkce může být použita pro JavaScriptové animace. V takovém případě, je potřeba nastavit vlastnost <code>fading</code> na <code>UXN.FADING_TYPE.JS</code> a po skončení animace, zavolat callback (čtvrtý parametr) a odstranit z atributu <code>style</code> vlastnosti[1], které odstraňují element z dokumentu (<code>display</code>). Třída <code>UXN__item--opened</code> musí otevírat nabídku i přesto, že je to zajištěno JS[2]. Viz demo <a href="http://michaljerabek.github.io/UXN#5">#5</a>. (*1 a *2 platí, pokud se používá nastavování pozic.)
        <br> - Parametry:
        <br>
        <ul>
            <li><code>jQuery</code> - element nabídky</li>
            <li><code>jQuery</code> - element položky.</li>
            <li><code>jQuery</code> - element otevíracího prvku</li>
            <li><code>Function</code> - callback oznamující zavření nabídky po skončení animace.</li>
        </ul>

        - Typ: <code>Function [&lt;= boolean]</code>
    </li>

    <li>
        <code>waitForFading</code> (výchozí: <code>false</code>):
        <br> - Ve výchozím nastavení je možné používat jen jednu instanci UXN. Díky tomu, v případě že procházíte navigací a přejedete myší přes jinou navigaci UXN, se tato navigace neotevře. Vlastnost <code>waitForFading</code> určuje, že se může další navigace otevřít až po té, co všechny nabídky kompletně zavřou (dokončí se přechody [transitions] nebo animace). Nastavením na <code>true</code> můžete předejít případnému překrývání nabídek.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>setPositions</code> (výchozí: <code>true</code>):
        <br> - Zapíná nastavování pozic nabídek, aby směřovaly do okna (stránky, elementu).
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>setPositionsOnReset</code> (výchozí: <code>true</code>):
        <br> - Pozice se budou nastavovat i po skrolování.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>setPositionsOnDeactivation</code> (výchozí: <code>true</code>):
        <br> - Pozice se přenastaví i po zavření navigace.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>setPositionsOnElement</code> (výchozí: <code>false</code>):
        <br> - Pozice se budou nastavovat i po změně velikosti stránky nebo elementu nastaveného v <code>positionBase</code>a <code>firstLevelPositionBase</code>.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>positionSkipOnFirstLevel</code> (výchozí: <code>true</code>):
        <br> - Při nastavování pozic budou ignorovány první podnabídky.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>positionBase</code> (výchozí: <code>UXN.POSITION_BASE.WINDOW</code>):
        <br> - Určuje, jestli se mají pozice nabídek nastavovat podle okna prohlížeče, stránky (<code>&lt;html&gt;</code>) nebo konkrétního elementu.
        <br> - Možnosti: <code>UXN.POSITION_BASE.WINDOW</code> | <code>UXN.POSITION_BASE.PAGE</code>
        <br> - Typ: <code>UXN.POSITION_BASE</code> / <code>jQuery</code> / <code>HTMLElement</code>
    </li>

    <li>
        <code>firstLevelPositionBase</code> (výchozí: <code>UXN.POSITION_BASE.WINDOW</code>):
        <br> - Určuje, jestli se mají pozice první úrovně nabídek nastavovat podle okna prohlížeče, stránky (<code>&lt;html&gt;</code>) nebo konkrétního elementu.
        <br> - Není-li specifikováno v nastavovacím objektu (<code>options</code>) jinak, <code>fristLevelPositionsFromCenter</code> se nastaví na <code>true</code> a <code>positionSkipOnFirstLevel</code> na <code>false</code>.
        <br> - Možnosti: <code>UXN.POSITION_BASE.WINDOW</code> | <code>UXN.POSITION_BASE.PAGE</code>
        <br> - Typ: <code>UXN.POSITION_BASE</code> / <code>jQuery</code> / <code>HTMLElement</code>
    </li>

    <li id="firstLevelPositionsFromCenter">
        <code>firstLevelPositionsFromCenter</code> (výchozí: <code>false</code>):
        <br> - Pozice na první úrovni podnabídek se nastaví tak, aby směřovaly do většího prostoru (podle umístění položek na stránce). Ostatní nabídky přejímají nastavení rodičovských nabídek, pokud je to možné. Vhodné pro nabídky, které jsou uprostřed stránky.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>positionOffset</code> (výchozí: <code>10</code>):
        <br> - Prostor v pixelech, který má být kolem nabídek od hran <code>positionBase</code>.
        <br> - Typ: <code>Number</code>
    </li>

    <!--
<li>
<code>onResetPositionsStart</code> (výchozí: <code>null</code>):<br> 

- Funkce se spustí před přenastavováním pozic nabídek. V případě, že funkce vrátí <code>false</code>, operace se nespustí.<br>

- Typ: <code>Function [&lt;= boolean]</code>
</li>

<li>
<code>onResetPositionsEnd</code> (výchozí: <code>null</code>):<br> 

- Funkce se spustí po přenastavení pozic nabídek.<br>

- Typ: <code>Function</code>
</li>
-->

    <li>
        <code>debug</code> (výchozí: <code>false</code>):
        <br> - Aktivuje zobrazování testovaných zón pro zjištění, jestli uživatel směřuje k nabídce, a přidávání tříd. Není k dispozici v minifikované verzi. (Doporučuji testovat v Chromu, Opeře nebo ve Firefoxu. Nelze vyloučit nesprávnou funkčnost kvůli neznámenu nastavení CSS.)
        <br> - Typ: <code>Boolean</code>
    </li>

</ul>

<h2>Globální nastavení</h2>

<ul>

    <li>
        <code>UXN.VENDOR_PREFIXES</code> (výchozí: <code>false</code>):
        <br> - Nastavuje, jestli přechody (transitions) nebo animace používají CSS prefixy (<code>-webkit-</code>, <code>-moz-</code>, ...).
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>UXN.MULTIPLE_INSTANCES</code> (výchozí: <code>false</code>):
        <br> - Nastavuje, jestli je možné používat více instancí najednou.
        <br> - Typ: <code>Boolean</code>
    </li>

    <li>
        <code>UXN.SKIP_MOUSE_EVENTS</code> (výchozí: <code>0</code>):
        <br> - Určuje, kolik událostí <code>onmousemove</code> se má přeskočit. V případě použití delšího času <code>insideTimeout</code> můžete prohlížeči ušetřit trochu práce.
        <br> - Typ: <code>Number</code>
    </li>

    <li>
        <code>UXN.DEFAULTS</code> (výchozí: <code>{...}</code>):
        <br> - Výchozí nastavení.
        <br> - Typ: <code>Object</code>
    </li>

    <li>
        <code>UXN.PREFIX</code> (výchozí: <code>"UXN"</code>):
        <br> - Prefix nastavovaných výchozích tříd a dat přiřazených k elementům.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>UXN.EVENT_NS</code> (výchozí: <code>"UXN"</code>):
        <br> - Jmenný prostor (namespace) událostí.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>UXN.BEM.EL</code> (výchozí: <code>"__"</code>):
        <br> - Oddělovač bloku a elementu ve výchozích třídách.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>UXN.BEM.MOD</code> (výchozí: <code>"--"</code>):
        <br> - Oddělovač elementu a modifikátoru ve výchozích třídách.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>UXN.POSITIONS.IDS.STYLE</code> (výchozí: <code>"UXN-positioning__reset-start"</code>):
        <br> - <code>id</code> elementu <code>style</code> v elementu <code>head</code> používaný pro resetování pozic nabídek.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>UXN.POSITIONS.CLASSES.RESET</code> (výchozí: <code>"UXN-positioning__style" </code>):
        <br> - Třída použitá pro resetování pozic nabídek.
        <br> - Typ: <code>String</code>
    </li>

    <li>
        <code>UXN.DEBUG</code>:
        <br> - Nastavení debug módu.
    </li>

</ul>

<h2>Metody</h2>

<ul>

    <li>
        <code>destroy()</code>:
        <br> - Odstraní instanci.
        <br>
    </li>

    <li>
        <code>refresh([options])</code>:
        <br> - Obnoví instanci.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>Object</code> - nové nastavení</li>
        </ul>
    </li>

    <li>
        <code>open(subnav [, notParents]) &lt;= <code>Boolean</code></code>:
        <br> - Otevře nabídku. V případě otevření (nenastala chyba) vrací <code>true</code>, jinak <code>false</code>.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>String</code> / <code>HTMLElement</code> / <code>jQuery</code> - nabídka, která se má otevřít.</li>
            <li><code>Boolean</code> - neotevírat nadřazené nabídky.</li>
        </ul>
    </li>

    <li>
        <code>close([subnav, preserveFirstLevel]) &lt;= <code>Boolean</code></code>:
        <br> - Zavře nabídku. V případě zavření vrací <code>true</code>, jinak <code>false</code>. Pokud je metoda volána bez parametrů, zavře se celá navigace.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>String</code> / <code>HTMLElement</code> / <code>jQuery</code> - nabídka, která se má zavřít.</li>
            <li><code>Boolean</code> - v případě zapnutí <code>doNotCloseFirstLevel</code> neskryje nabídku první úrovně.</li>
        </ul>
    </li>

    <li>
        <code>sleep([touchEvents])</code>:
        <br> - Instance přestane reagovat na události.
        <br> - Parametry:
        <br>
        <ul>
            <li><code>Boolean</code> - vypnou se i dotykové události.</li>
        </ul>
    </li>

    <li>
        <code>wake()</code>:
        <br> - Instance opět začne reagovat na události.
        <br>
    </li>

    <li>
        <code>toggleDebug()</code>:
        <br> - Vypne/zapne debug mód. (Není k dispozici v minifikované verzi.)
        <br>
    </li>

    <li>
        - Spousta dalších samovysvětlujících metod pro procházení navigací. Doporučuji prostudovat ve vývojářských nástrojích v Chromu.
    </li>
</ul>

<p>Upozornění: Nativní metody jako <code>querySelector</code> a <code>querySelectorAll</code> nevybírají vždy ty samé elementy jako jQuery (a nepoužívají úplně stejné selektory). Používejte proto jenom selektory, které vždy vyberou to samé. Více info <a href="https://www.lvh.io/posts/queryselectorall-from-an-element-probably-doesnt-do-what-you-think-it-does.html">zde</a>.</p>
