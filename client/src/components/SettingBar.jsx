import toolsState from '../store/toolsState';
import '../styles/toolbar.scss'

const SettingBar = () => {
  return (
    <div className='setting-bar'>
      <label htmlFor="line-width">Line width</label>
      <input
        onChange={e => toolsState.setLineWidth(e.target.value)}
        style={{margin: '0 10px'}}
        id='line-width'
        type="number" min={1} max={50} defaultValue={1}
      />
      <label htmlFor="stroke-color">Stroke Color</label>
      <input type="color" id="stroke-color"m className='stroke-color' onChange={e => toolsState.setStrokeColor(e.target.value)}/>
    </div>
  );
};

export default SettingBar;