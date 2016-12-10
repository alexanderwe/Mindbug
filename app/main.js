const electron = require('electron')
const {Menu} = require('electron')
const {globalShortcut} = require('electron')
const {ipcMain} = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let taskWindow



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minHeight: 300,
      minWidth: 520,
      titleBarStyle: 'hidden',
      title: 'Mindbug',
      vibrancy: 'dark'
    });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
  const template = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      label: 'Edit',
      submenu : [
          {
              label: 'Add a task',
              accelerator: 'CommandOrControl+Shift+T',
              click (){createTaskWindow()}
          }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Visit at github',
          click () { require('electron').shell.openExternal('https://github.com/alexanderwe/mindbug') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Preferences',
          accelerator: 'CommandOrControl+,',
          click(){console.log("preferences");}
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

}


//Create the task window
function createTaskWindow(){
    taskWindow = new BrowserWindow({
        width: 520,
        height: 350,
        minHeight: 350,
        minWidth: 520,
        titleBarStyle: 'hidden',
        title: 'Mindbug - Create a task',
        vibrancy: 'dark'
    });

    // and load the index.html of the app.
    taskWindow.loadURL(url.format({
      pathname: path.join(__dirname, './windows/createTasks/createTask.html'),
      protocol: 'file:',
      slashes: true
    }))

    taskWindow.on('closed', function () {
       // Dereference the window object, usually you would store windows
       // in an array if your app supports multi windows, this is the time
       // when you should delete the corresponding element.
       taskWindow = null;
    })
}

ipcMain.on('created-task', (event, arg) => {
    mainWindow.webContents.send('insert-task' , {msg:arg});
    taskWindow.close();
})

ipcMain.on('set-app-badge',(event,arg)=>{
    app.dock.setBadge(arg.toString());

})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
    createWindow();
    const ret = globalShortcut.register('CommandOrControl+Shift+T', () => {
        createTaskWindow()
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
