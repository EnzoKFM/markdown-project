import { Provider } from 'react-redux'
import Arborescence from './arborescence/Arborescence'
import store from '../store/store'

function App() {

  return (
    <>
      <div>
        <Provider store={store}>
          <Arborescence />
        </Provider>
      </div>
    </>
  )
}

export default App
