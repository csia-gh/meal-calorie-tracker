// Storage Controller -------------------------------------------------------
const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items;

      // check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

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
    // items: [
    //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   { id: 1, name: "Cookie", calories: 400 },
    //   { id: 2, name: "Eggs", calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  //  Public methods
  return {
    getItems: function(StorageCtrl) {
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
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // cals to num
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id) {
      // get ids
      ids = data.items.map(item => {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // set total cal in data struc.
      data.totalCalories = total;

      return total;
    }
  };
})(StorageCtrl);

// UI Controller --------------------------------------------------------------------
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  //  Public methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `<li class="list-group-item d-flex justify-content-between align-items-center" id="item-${item.id}">
        <span><strong>${item.name}: </strong> <em>${item.calories} Calories</em></span>
        <span class="badge badge-pill badge-light p-2"><a class="text-success" href="#"
          ><i class="edit-item fas fa-pencil-alt"></i></a></span>
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
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // add id
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `<span><strong>${item.name}: </strong> <em>${item.calories} Calories</em></span>
      <span class="badge badge-pill badge-light p-2"><a class="text-success" href="#"
          ><i class="edit-item fas fa-pencil-alt"></i></a></span>`;

      // insert
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // convert node list to array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<span><strong>${item.name}: </strong> <em>${item.calories} Calories</em></span>

          <span class="badge badge-pill badge-light p-2"><a class="text-success" href="#"
          ><i class="edit-item fas fa-pencil-alt"></i></a></span>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    addItemToForm: function(cItem) {
      document.querySelector(UISelectors.itemNameInput).value = cItem.name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        cItem.calories;
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);
      listItems.forEach(item => {
        item.remove();
      });
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    clearEditState: function() {
      UICtrl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return Object.assign({}, UISelectors);
    }
  };
})();

// App Controller ----------------------------------------------------------------------
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // load event listeners
  const loadEventListeners = function() {
    // get ui selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // 'back' button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
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

      // add item to UI list
      UICtrl.addListItem(newItem);

      // get total cal.
      const totalCalories = ItemCtrl.getTotalCalories();
      // add totCal to UI
      UICtrl.showTotalCalories(totalCalories);

      // store in ls
      StorageCtrl.storeItem(newItem);

      // clear input fields
      UICtrl.clearInputs();
    }
  };

  // itemEditClick
  const itemEditClick = function(e) {
    e.preventDefault();

    if (e.target.classList.contains("edit-item")) {
      // get list item id
      const listId = e.target.parentNode.parentNode.parentNode.id;
      const listIdArr = listId.split("-");
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm(ItemCtrl.getCurrentItem());

      UICtrl.showEditState();
    }
  };

  // itemUpdateSubmit
  const itemUpdateSubmit = function(e) {
    e.preventDefault();

    // get item inputs
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update ui
    UICtrl.updateListItem(updatedItem);

    // get total cal.
    const totalCalories = ItemCtrl.getTotalCalories();
    // add totCal to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
  };

  // itemDeleteSubmit
  const itemDeleteSubmit = function(e) {
    e.preventDefault();

    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data struc.
    ItemCtrl.deleteItem(currentItem.id);

    // delte from ui
    UICtrl.deleteListItem(currentItem.id);

    // get total cal.
    const totalCalories = ItemCtrl.getTotalCalories();
    // add totCal to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
  };

  // clearAllItemsClick
  const clearAllItemsClick = function(e) {
    e.preventDefault();

    // delete all items from data struc.
    ItemCtrl.clearAllItems();

    // get total cal.
    const totalCalories = ItemCtrl.getTotalCalories();
    // add totCal to UI
    UICtrl.showTotalCalories(totalCalories);

    // remove from ui
    UICtrl.removeItems();

    // Clear from lc
    StorageCtrl.clearItemsFromStorage();

    UICtrl.clearEditState();
  };

  // Public methods
  return {
    init: function() {
      console.log("init..");

      // set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemList(items);

      // get total cal.
      const totalCalories = ItemCtrl.getTotalCalories();
      // add totCal to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Init app
AppCtrl.init();
