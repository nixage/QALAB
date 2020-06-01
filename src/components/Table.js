
export class Table{ 
  
  constructor(root, component){
    this.root = document.querySelector(root);
    this.component = component
  }

  createComponent() { 
    const table = document.createElement('div');
    table.classList.add('table')
    const component = new this.component(table);
    component.init()
    return table
  }

  render(){
    this.root.append(this.createComponent());
  }
}