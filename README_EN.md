<h1>UXN (1.0 Beta) - Documentation</h1>

<p>UXN allows you to create user-friendly navigations. It tracks, if the mouse is moving to any menu, and if so, then the menu stays opened. As a result, the user need not to browse through the navigation like a robot and be moving the mouse at right angles (see the animation below).</p>

<p>The second function of UXN is adjusting positions of submenus into the browser window (page or element).</p>

<p>UXN works exclusively on the basis of classes (<code>class</code> attribute) and thus it doesn't modify the <code>style</code> attribute of elements. All class names can be changed however you want.</p>

<p>UXN uses native methods and APIs (<code>closest</code>, <code>matches</code>, <code>classList</code>, ...), if they are available to ensure maximum efficiency.</p>

<figure><img src="uxn-demo.gif" alt="UXN"></figure>

<h2>Dependencies</h2>

<p><strong>jQuery</strong> - tested with version 1.11.3</p>

<h2>Browser support</h2>

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

<p>On touch devices may be useful to use a dedicated opening element (see demo <a href="http://michaljerabek.github.io/UXN#3">#3</a>), if we want to be able to use item's link and be able to open a submenu inside the item. The HTML could look like this:</p>

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

<h2>Classes Used for Browsing a Menu</h2>

<h3>Initialization and Activation</h3>

<ul>
    <li>
        <code>UXN__item--has-subnav</code> (<code>itemHasSubnav</code>):
        <br> - Item with submenu.
    </li>

    <li>
        <code>UXN__opener--has-subnav</code> (<code>openerHasSubnav</code>):
        <br> - Opening element with submenu.
    </li>

    <li>
        <code>UXN</code> (<code>instance</code>):
        <br> - Element that is an instance of UXN (set by the <code>nav</code> property). (Can be used for creating a fallback for users with disabled JS.)
    </li>

    <li>
        <code>UXN--active</code> (<code>activeInstance</code>):
        <br> - Element that is an instance of UXN and user is browsing the menu.
    </li>
</ul>

<h3>Opening of Submenu</h3>

<ul>
    <li>
        <code>UXN__item--opened</code> (<code>itemOpened</code>):
        <br> - Item with an opened submenu. This class should not be used for setting any visual styles (<code>background-color</code>, ...) and should ensure only the opening of submenu (in the final position; [<code>display</code>, <code>transform</code>, <code>left</code>, ...]). (For visual styles can be used <code>UXN__item--highlighted</code>.)
    </li>

    <li>
        <code>UXN__opener--opened</code> (<code>openerOpened</code>):
        <br> - Opening element with an opened submenu. This class should not be used for setting any visual styles (<code>background-color</code>, ...) and should ensure only the opening of submenu (in the final position; [<code>display</code>, <code>transform</code>, <code>left</code>, ...]). (For visual styles can be used <code>UXN__opener--highlighted</code>.)
        </li>

    <li>
        <code>UXN__item--highlighted</code> (<code>itemHighlighted</code>):
        <br> - Item with an opened submenu.
    </li>

    <li>
        <code>UXN__opener--highlighted</code> (<code>openerHighlighted</code>):
        <br> - Opening element with an opened submenu.
    </li>

    <li>
        <code>UXN__subnav--has-opened</code> (<code>subnavHasOpened</code>):
        <br> - Submenu with an opened item.
    </li>

    <li>
        <code>UXN__subnav--current</code> (<code>currentSubnav</code>):
        <br> - Submenu the mouse is over (or last was).
    </li>
</ul>

<h3>Closing of Submenu</h3>

<ul>

    <li>
        <code>UXN__item--has-fading-out</code> (<code>itemHasFadingOut</code>):
        <br> - Item, which submenu is closing. (Only if <code>fading</code> is used.)
    </li>

    <li>
        <code>UXN__opener--has-fading-out</code> (<code>openerHasFadingOut</code>):
        <br> - Opening element, which submenu is closing. (Only if <code>fading</code> is used.)
    </li>

    <li>
        <code>UXN__subnav--has-fading-out</code> (<code>subnavHasFadingOut</code>):
        <br> - Submenu, that has a closing submenu. (Only if <code>fading</code> is used.)
    </li>

    <li>
        <code>UXN-no-fading</code> (<code>noFading</code>):
        <br> - Submenu, that does not use transitions or animations. In case of some submenus use transitions or animations and some not, it's necessary to identify for which submenus should not be expected a <code>transitionend</code> / <code>animationend</code> event (or a <code>done</code> function call in case of using JS animations).
    </li>

    <li>
        <code>UXN-sliding--vertical</code> (<code>slidingVertical</code>):
        <br> - It allows custom control of opening submenus. In case that a submenu has a <code>UXN-sliding--vertical</code> class, the submenu is opened without having to stop the mouse, if mouse is moving vertically.
    </li>

    <li>
        <code>UXN-sliding--horizontal</code> (<code>slidingHorizontal</code>):
        <br> - It allows custom control of opening submenus. In case that a submenu has a <code>UXN-sliding--horizontal</code> class, the submenu is opened without having to stop the mouse, if mouse is moving horizontally.
        </li>
</ul>

<p>Classes containing "fading" are important for the correct work of transitions and animations. They are mainly used to set the element to <code>overflow: visible;</code>, in order to its closing submenu would be visible.</p>

<h3>Other</h3>

<ul>

    <li>
        <code>UXN-exclude</code> (<code>exclude</code>):
        <br> - Submenu that should be excluded from the mouse tracking.
    </li>

    <li>
        <code>UXN-exclude--inside</code> (<code>excludeInside</code>):
        <br> - Submenu that should be excluded from the mouse tracking, if the mouse is inside the submenu. (See demo <a href="http://michaljerabek.github.io/UXN#6">#6</a>.)
        <br> - Useful only if <code>hideFollowing</code> is set to <code>false</code>.
    </li>

    <li>
        <code>UXN-horizontal</code> (<code>horizontal</code>):
        <br> - Submenu, which is horizontal. (Important, if <code>allowSliding</code> is set to <code>true</code>. <a href="#allowSliding">More info</a>.)
    </li>
</ul>

<h2>Adjusting Positions</h2>

<p>Basic process is as follows:</p>

<ol>
    <li>Set styles for submenus to default direction. (For example: Submenus will be positioned down right)</li>
    <li>Set styles to classes in the opposite direction. (For example <code>UXN__subnav--top</code> and <code>UXN__subnav--left</code>.)</li>
</ol>

<p>If a submenu fits into the window (page, element) and thus its position is not changed, the submenu will not have any class except in the case, that adjusting positions from the center is used. <a href="#firstLevelPositionsFromCenter">More info.</a></p>

<p>If the positions are adjusted by the page (<code>&lt;html&gt;</code>) and the page is smaller then the browser window, the window is used instead.</p>

<p>If a submenu does not fit into the window (page, element) even in the changed position, direction down right is preferred.</p>

<p>The first level of submenus can be adjusted by a different base then the others. In that case the property <code>firstLevelPositionsFromCenter</code> is set to <code>true</code>, if the property is not explicitly set to <code>false</code>. The other submenus will then continue the direction from the first level.</p>

<p>Setting the base for positioning:</p>

<pre>var mainNav = new UXN({
    nav: "#main-nav",
    positionBase: UXN.POSITION_BASE.PAGE // UXN.POSITION_BASE.WINDOW // $("#wrapper") // document.getElementById("wrapper")
});</pre>

<p>Classes used for adjusting positions</p>

<ul>

    <li>
        <code>UXN-position--skip</code> (<code>positionSkip</code>):
        <br> - It may be set to submenus that should not be positioned. Typically, the first level of submenus. (May be set by code>positionSkipOnFirstLevel: true</code>, in this case, you don't have to add these classes.)
    </li>

    <li>
        <code>UXN__subnav--left</code> (<code>subnavLeft</code>) |
        <code>UXN__subnav--right</code> (<code>subnavRight</code>) |
        <code>UXN__subnav--top</code> (<code>subnavTop</code>) |
        <code>UXN__subnav--bottom</code> (<code>subnavBottom</code>):
        <br> - A submenu which should be positioned in the corresponding direction.
    </li>

    <li>
        <code>UXN__item--has--left</code> (<code>itemHasLeft</code>) |
        <code>UXN__item--has--right</code> (<code>itemHasRight</code>) |
        <code>UXN__item--has--top</code> (<code>itemHasTop</code>) |
        <code>UXN__item--has--bottom</code> (<code>itemHasBottom</code>):
        <br> - An item with a submenu in the corresponding direction.
    </li>

    <li>
        <code>UXN__opener--has--left</code> (<code>openerHasLeft</code>) |
        <code>UXN__opener--has--right</code> (<code>openerHasRight</code>) |
        <code>UXN__opener--has--top</code> (<code>openerHasTop</code>) |
        <code>UXN__opener--has--bottom</code> (<code>openerHasBottom</code>):
        <br> - An opening element with a submenu in the corresponding direction.
        </li>
</ul>

<p>Note: The process of adujsting positions causes delay before the corresponding submenu is opened. Some browsers (IE) may not respond for a few milliseconds.</p>

<h2>Options</h2>

<p>To set up custom classes, see above.</p>

<p>Options can be changed at runtime by <code>instance.opt.property</code>, but do not change classes.</p>

<ul>

    <li>
        <code>nav</code> (default: <code>"#main-nav"</code>):
        <br> - Selector for an element wrapping the navigation (Must be unique.)
        <br> - Type: <code>String</code>
    </li>

    <li>
        <code>item</code> (default: <code>"li"</code>):
        <br> - Selector for items of the navigation. (Inside the navigation the selector must not select anything but items.)
        <br> - Type: <code>String</code>
    </li>

    <li>
        <code>subnav</code> (default: <code>"ul"</code>):
        <br> - Selector for submenus of the navigation. (Inside the navigation the selector must not select anything but submenus.)
        <br> - Type: <code>String</code>
    </li>

    <li>
        <code>opener</code> (default: value from <code>item</code>):
        <br> - Selector for opening elements of the navigation. (Inside the navigation the selector must not select anything but opening elements.)
        <br> - Type: <code>String</code>
    </li>

    <li>
        <code>closer</code> (default: <code>"a"</code>):
        <br> - Selector for elements closing the navigation on click.
        <br> - Type: <code>String</code>
    </li>

    <li>
        <code>autoSleep</code> (default: <code>true</code>):
        <br> - The navigation stop responding to events, if it's outside the viewport (or inside an element with <code>display: none</code>).
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>fading</code> (default: <code>UXN.FADING_TYPE.NONE</code>):
        <br> - Sets, whether the navigation uses CSS Transitions, CSS Animations or JavaScript animations.
        <br> - Options: <code>UXN.FADING_TYPE.TRANSITION</code> |
        <code>UXN.FADING_TYPE.ANIMATION</code> |
        <code>UXN.FADING_TYPE.JS</code> |
        <code>UXN.FADING_TYPE.NONE</code>
        <br> - Type: <code>UXN.FADING_TYPE</code>
    </li>

    <li>
        <code>animation</code> (default: <code>"UXN-hide"</code>):
        <br> - Název animace (nebo pole názvů), která zavírá nabídku.
        <br> - Name of the animation (or array with names) used for closing a submenu.
        <br> - Type: <code>String</code> / <code>Array</code>
    </li>

    <li>
        <code>delayHide</code> (default: <code>false</code>):
        <br> - Sets, whether an opened submenu should be closed immediately after the mouse leaves the item or just before another submenu is opened (or the mouse is not moving for an <code>openTimeout</code>).
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>autoHide</code> (default: <code>true</code>):
        <br> - Sets, if in the case, that the mouse is stopped outside the navigation, the navigation should be automatically closed after an <code>outsideTimeout</code>.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>closeOnlyInLevel</code> (default: <code>false</code>):
        <br> - It will only close the submenu, which is at the same level as the newly opened. This allows you to keep open the last submenu. See demo <a href="http://michaljerabek.github.io/UXN#6">#6</a>.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>doNotCloseFirstLevel</code> (default: <code>false</code>):
        <br> - The last opened submenu at the first level stays always opened. (During the initialization a submenu at the first level can be opened by an <code>onInit</code> handler by using <code>open</code> method.)
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>hideFollowing</code> (default: <code>true</code>):
        <br> - Sets, if the submenus following a submenu the mouse is over should be immediately closed even if the <code>insideTimeout</code> timer did not elapse. (Applicable if the user is browsing the navigation [moving the mouse] backwards.) If the <code>insideTimeout</code> is set to a longer time and <code>hideFollowing</code> to <code>false</code>, then the user may return back, if he/she realizes, that the searched item is inside already opened submenu (several levels down), but he/she had moved back into a different submenu (several levels up).
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>keepOpened</code> (default: <code>true</code>):
        <br> - The last opened item stays opened even if the mouse is outside of any item (but inside the same submenu).
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>excludeFirstLevel</code> (default: <code>true</code>):
        <br> - Excludes the first level from mouse tracking.
        <br> - Type: <code>Boolean</code>
    </li>

    <li id="allowSliding">
        <code>allowSliding</code> (default: <code>true</code>):
        <br> - Sets, if the user does not have to stop the mouse over an item for a time set by <code>openTimeout</code> before a submenu is opened. This feature takes into account the layout of the current submenu. In case that <code>ignoreLayoutOnSliding</code> is set to <code>false</code> (default), it is necessary to add a class specified in <code>horizontal</code> to submenus, which are horizontal. (The default behavior can be overridden using classes.)
        <br> - If the adjusting of positions is used, opening will be delayed a little more.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>allowSlidingOnFirstLevel</code> (default: <code>false</code>):
        <br> - Sets, if <code>allowSliding</code> is used even for the first level.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>ignoreLayoutOnSliding</code> (default: <code>false</code>):
        <br> - Sets, if <code>allowSliding</code> feature should take into account the layout of the current submenu. (If a submenu is vertical, the need to stop the mouse will be applied only if the mouse is moving vertically.) 
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>slidingZone</code> (default: <code>75</code>):
        <br> - Sets the percentage size of the zone (from the farther side of the cursor), in which the opening of submenus won't be delayed.
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>openTimeout</code> (default: <code>30</code>):
        <br> - Sets the time for which the user must stop the mouse over an item to open it.
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>preventClickOnTouch</code> (default: <code>true</code>):
        <br> - Sets, whether click events (<code>onclick</code>) should be blocked (<code>preventDefault</code>), if the user taps (<code>ontouchend</code>) on an item with a submenu (and without an opening element).
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>closeOnClick</code> (default: <code>false</code>):
        <br> - Sets, whether the navigation should be closed after the user clicks (anywhere).
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>mouseTolerance</code> (default: <code>1</code>):
        <br> - The number of pixels in the direction of the mouse movement, that should be taken into account when testing, whether the mouse is moving towards any submenu. 
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>minZoneExt</code> (default: <code>25</code>):
        <br> - Sets s minimum extention of the zone, which is considered as "moving towards the menu". (The size of the extension increases with increasing distance from the mouse to the navigation. For an example, see the <a href="http://michaljerabek.github.io/UXN#2">demo</a> and turn on debug mode.)
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>maxZoneExt</code> (default: <code>250</code>):
        <br> - Sets s maximum extention of the zone, which is considered as "moving towards the menu". (The size of the extension increases with increasing distance from the mouse to the navigation. For an example, see the <a href="http://michaljerabek.github.io/UXN#2">demo</a> and turn on debug mode.)
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>zoneExtOffset</code> (default: <code>0</code>):
        <br> - Sets s fixed extention (reduction) of the zone, which is considered as "moving towards the menu". (The value is added to the result.)
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>surroundingZone</code> (default: <code>15</code>):
        <br> - Size (in px) of a zone around a submenu to which the user may move the mouse and the navigation won't be immediately closed (but for the time set in <code>surroundingTimeout</code>).
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>insideTimeout</code> (default: <code>30</code>):
        <br> - The time at which the submenu will be closed, if the user is not moving the mouse towards it, if the mouse is inside the navigation.
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>outsideTimeout</code> (default: <code>400</code>):
        <br> - The time at which the navigation will be closed, if the user is not moving the mouse towards it, if the mouse is outside the navigation.
        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>surroundingTimeout</code> (default: <code>600</code>):
        <br> - The time at which the navigation will be closed, if the user is not moving the mouse towards it, if the mouse hits a <code>surroundingZone</code>.

        <br> - Type: <code>Number</code>
    </li>

    <li>
        <code>isFadedOut</code>:
        <br> - Function to determine whether a currently closing submenu is closed. (It's called on <code>transitionend</code>.) Important for the proper functioning of CSS Transitions. The default function detects if the <code>transitionend</code> event was triggered by <code>visibility</code> property.
        <br> - Parameters:
        <br>
        <ul>
            <li><code>jQuery</code> - element of the submenu</li>
            <li><code>TransitionEvent</code></li>
            <li><code>Function</code> - callback notifying that the submenu was closed, which can be called later</li>
        </ul>
        <br> - The function must return <code>false</code>, if the submenu was not closed. In case it was, then <code>true</code>.
        <br> - When using transitions, it's strongly recommended to use the pattern used above (a submenu is opened/closed by <code>visibility</code>, which is set in the <code>transition</code> property with a delay and a class <code>UXN__item--opened</code> removes the <code>visitility</code> from the <code>transition</code>), because <code>TransitionEvent</code> may not be triggered if the submenu is switched fast (but in case of <code>visibility</code> it works every time) or the <code>TransitionEvent</code> may be captured from a previous event.
        <br> - Type: <code>Function &lt;= Boolean</code>
    </li>

    <li>
        <code>onInit</code> (default: <code>null</code>):
        <br> - Function is called at the end of initialization.
        <br> - Type: <code>Function</code>
    </li>

    <li>
        <code>onSubnavChange</code> (default: <code>null</code>):
        <br> - Function is called when the mouse is moved to a different submenu.
        <br> - Parameters:
        <br>
        <ul>
            <li><code>jQuery</code> - element with the current submenu</li>
        </ul>

        <br> - Type: <code>Function</code>
    </li>

    <li>
        <code>onOpen</code> (default: <code>null</code>):
        <br> - Function is called before a submenu is opened. If the function returns <code>false</code>, the submenu won't be opened.
        <br> - Function can be used for JavaScipt animations. (See the demo <a href="http://michaljerabek.github.io/UXN#5">#5</a>.)
        <br> - Parameters:
        <ul>
            <li><code>jQuery</code> - element with the submenu</li>
            <li><code>jQuery</code> - element with the corresponding item</li>
            <li><code>jQuery</code> - the corresponding opening element</li>
        </ul>

        <br> - Type: <code>Function [&lt;= Boolean]</code>
    </li>

    <li>
        <code>onClose</code> (default: <code>null</code>):
        <br> - Function is called before a submenu is closed. If the function returns <code>false</code>, the submenu won't be closed.
        <br> - Function can be used for JavaScipt animations. In that case it's necessary to set the property <code>fading</code> to <code>UXN.FADING_TYPE.JS</code> and after the animation ends call the callback function and remove from the <code>style</code> attribute properties[1] that removes (not literally) the submenu from the document (most likely a <code>display</code> property). The <code>UXN__item--opened</code> class must open the submenu[2], although this is done using JS. See the demo <a href="http://michaljerabek.github.io/UXN#5">#5</a>. (*1 and *2 is true when using the position adjusting feature.)
        <br> - Parameters:
        <br>
        <ul>
            <li><code>jQuery</code> - element with the submenu</li>
            <li><code>jQuery</code> - element with the corresponding item</li>
            <li><code>jQuery</code> - the corresponding opening element</li>
            <li><code>Function</code> - callback notifying the end of the animation (the submenu is closed)</li>
        </ul>

        - Type: <code>Function [&lt;= Boolean]</code>
    </li>

    <li>
        <code>waitForFading</code> (default: <code>false</code>):
        <br> - By default, it is possible to use (browsing) only one instance. Thanks to this, if the user is browsing a navigation and hover over another navigation (UXN instance), this navigation won't be opened. The <code>waitForFading</code> property sets, whether another navigation should be openable until after all animations/transitions were completed.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>setPositions</code> (default: <code>true</code>):
        <br> - Turn on position adjusting of submenus to fit the browser window (page, element);
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>setPositionsOnReset</code> (default: <code>true</code>):
        <br> - Positions will be reset even after scrolling.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>setPositionsOnDeactivation</code> (default: <code>true</code>):
        <br> - Positions will be reset even after the navigation is closed.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>setPositionsOnElement</code> (default: <code>false</code>):
        <br> - Positions will be reset even after the size of the page or the element set in <code>positionBase</code> or <code>firstLevelPositionBase</code> is changed.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>positionSkipOnFirstLevel</code> (default: <code>true</code>):
        <br> - Submenus at the first level won't be positioned.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>positionBase</code> (default: <code>UXN.POSITION_BASE.WINDOW</code>):
        <br> - Sets, whether the positions should be set based on the browser window, the page (<code>&lt;html&gt;</code>) or a specific element.
        <br> - Options: <code>UXN.POSITION_BASE.WINDOW</code> | <code>UXN.POSITION_BASE.PAGE</code>
        <br> - Type: <code>UXN.POSITION_BASE</code> / <code>jQuery</code> / <code>HTMLElement</code>
    </li>

    <li>
        <code>firstLevelPositionBase</code> (default: <code>UXN.POSITION_BASE.WINDOW</code>):
        <br> - Sets, whether the positions at the first level should be set based on the browser window, the page (<code>&lt;html&gt;</code>) or a specific element.
        <br> - If this option is set and it is not specified in the setting object otherwise, <code>fristLevelPositionsFromCenter</code> is set to <code>true</code> and <code>positionSkipOnFirstLevel</code> to <code>false</code>.
        <br> - Options: <code>UXN.POSITION_BASE.WINDOW</code> | <code>UXN.POSITION_BASE.PAGE</code>
        <br> - Type: <code>UXN.POSITION_BASE</code> / <code>jQuery</code> / <code>HTMLElement</code>
    </li>

    <li id="firstLevelPositionsFromCenter">
        <code>firstLevelPositionsFromCenter</code> (default: <code>false</code>):
        <br> - Position at the first level will be set to be directed to a larger space (based on the postions of items). The following submenus will follow positions of its parent submenus, if possible.
        <br> - Type: <code>Boolean</code>
    </li>

    <li>
        <code>positionOffset</code> (default: <code>10</code>):
        <br> - Space (in px) that should be around the edges of <code>positionBase</code>.
        <br> - Type: <code>Number</code>
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
        <code>debug</code> (default: <code>false</code>):
        <br> - Turns on displaying of tested zones used to determine whether the mouse is moving towards a submenu, and added classes. Not available in minified version. (I recommend to test it in Chrome, Opera or Firefox. Correct functioning can not be guaranteed due to the unknown CSS.)
        <br> - Type: <code>Boolean</code>
    </li>

</ul>

<h2>Global Settings</h2>

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
