#  editorjs-audio-tool

Audio Tool for Editor.js

## Install

#### For React

```bash
npm i  editorjs-audio-tool
```

example

```js
import { useEffect } from 'react'
import AudioTool from 'editorjs-audio-tool'
import EditorJS from '@editorjs/editorjs'
import 'editorjs-audio-tool/dist/style.css'
function App() {
  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        audio: {
          class: AudioTool,
          config: {
            endpointUrl: 'http://localhost:8080/upload',
          },
        },
      },
    })
    return () => editor.destroy()
  }, [])

  return <div id='editorjs'></div>
}

export default App

```


#### For Vue3

```bash
npm i  editorjs-audio-tool
```

example

```js
<template>
    <div id='editorjs'></div>
</template>    
<script setup>
import { mounted, unmounted,ref } from 'vue'
import AudioTool from 'editorjs-audio-tool'
import EditorJS from '@editorjs/editorjs'
import 'editorjs-audio-tool/dist/style.css'
let editor = null
mounted(()=>{
     editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        audio: {
          class: AudioTool,
          config: {
            endpointUrl: 'http://localhost:8080/upload',
          },
        },
      },
    })
})

unmounted(()=>{
  editor.destroy()
})

```

#### For Static web

```html
<body>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
     <script src="https://cdn.jsdelivr.net/npm/editorjs-audio-tool@latest"></script>
    <div id="editorjs"></div>
    <script>
        const editor = new EditorJS({
            tools: {
                audio: {
                    class: AudioTool,
                    config: {
                        endpointUrl: "http://localhost:8080/upload",
                    }
                }
            },
            holder: "editorjs"
        });
    </script>
</body>
```



## API

##### Module config.

| Name          | Type                                        | Description                                               |
| ------------- | ------------------------------------------- | --------------------------------------------------------- |
| endpointUrl   | String                                      | Url endpoint to upload file to                            |
| dowloadable   | Boolean                                     | Set if audio display will have download button            |
| requestParser | Func(FetchRequestObject):FetchRequestObject | function to modify upload request before send             |
| respondParser | Func(FetchRespondObject):FetchRespondObject | function to modify upload respond before display in block |
| onDelete      | Func(EditorJSBlockObject)                   | this function is called after deleted                     |

* EditorJSBlockObject - editor js block object that consist of block id and others data

* FetchRequestObject - It is object that will be pass to fetch api function

* FetchRespondObject - It is object respond from uploading file with fetch api

  

##### Module data

| Name | Type   | Description                                               |
| ---- | ------ | --------------------------------------------------------- |
| url  | string | URL of the audio file                                     |
| type | string | this is mime type of the audio file such as "audio/mpeg3" |

