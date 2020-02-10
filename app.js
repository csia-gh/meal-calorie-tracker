// Storage Controller -------------------------------------------------------

// Item Controller -------------------------------------------------------
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State -------------------------------------------------------------
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  //  Public methods
  return {
    getItems: function() {
      return data.items.map(item => {
        return {
          id: item.id,
          name: item.name,
          calories: item.calories
        };
      });
    },
    logData: function() {
      return Object.assign({}, data);
    },
    addItem: function(name, calories) {
      // create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // cal to num
      calories = parseInt(calories);

      // create new item
      newItem = new Item(ID, name, calories);

      // add to items array
      data.items.push(newItem);

      return newItem;
    }
  };
})();

// UI Controller --------------------------------------------------------------------
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories"
  };

  //  Public methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"
          ><i class="edit-item fas fa-pencil-alt"></i
        ></a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // create li el
      const li = document.createElement("li");
      // add class
      li.className = "collection-item";
      // add id
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"
        ><i class="edit-item fas fa-pencil-alt"></i
      ></a>`;

      // insert
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    getSelectors: function() {
      return Object.assign({}, UISelectors);
    }
  };
})();

// App Controller ----------------------------------------------------------------------
const AppCtrl = (function(ItemCtrl, UICtrl) {
  // load event listeners
  const loadEventListeners = function() {
    // get ui selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  // itemAddSubmit
  const itemAddSubmit = function(e) {
    e.preventDefault();

    // get form input from ui controller
    const input = UICtrl.getItemInput();

    // check inputs
    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add iten to UI list
      UICtrl.addListItem(newItem);

      // clear input fields
      UICtrl.clearInputs();
    }
  };

  // Public methods
  return {
    init: function() {
      console.log("init..");

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

// Init app
AppCtrl.init();
