import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({ downPanelInRight: true });
  

function loadStories(){
    require('../examples/charts/index.js')
}

configure(loadStories, module);

