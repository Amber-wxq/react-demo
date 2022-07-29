import './Todo.css'

import React ,{useState} from 'react';
//正确

import _ from 'lodash';

function TodoList():JSX.Element{
    //form input输入值state
    const [addValue,setAddValue] = useState('')
    const [addDeadline,setAddDeadline] = useState('')
    //数组：存储每一条list。
    //遇到问题：数组为空时，报错，解决：类型断言
    const [items1,setItems1]= useState<{text:string,time:string}[]>([])
    
    //输入Todo，更新state
    function handleDesc(e:any){
        setAddValue(
            e.target.value
        )
        
    }
    //输入Deadline,更新state
    function handleDeadline(e:any){
        setAddDeadline(e.target.value)
    };
   // 提交，add按钮，更新组件
    function handleSubmit(e:any){
        
        e.preventDefault();
        let itemArr={text:addValue,time:addDeadline};
    
        let fitems1=_.cloneDeep(items1);
        fitems1.push(itemArr);

        setItems1(fitems1)
        
     
    }

    //删除事项
    function deleteItem(index:number){
        let fitems1=_.cloneDeep(items1);
        fitems1.splice(index,1);
        setItems1(fitems1);
    };
    //修改todo描述
    function updateDesc(index:number,desc:string){
        let fitems1=_.cloneDeep(items1);
        const upItem=fitems1[index];
       
        upItem['text']=desc;
        fitems1.splice(index,1,upItem);
        setItems1(fitems1);
    
        
    }
    //修改todo deadline
    function updateDeadline(index:number,deadline:string){
        let fitems1=_.cloneDeep(items1);
        const upItem=fitems1[index];
        upItem['time']=deadline;
        fitems1.splice(index,1,upItem);
        setItems1(fitems1);
    }

       return (
       <div className='Todo'>
        {/* 表单，收集输入信息的部分 */}
    <form onSubmit={handleSubmit}>
        <label >
        Todo:<input type="text" className="List-add" value={addValue} onChange={handleDesc} />
        </label>   
        <label >
        Deadline:<input type="date" className="List-d" value={addDeadline} onChange={handleDeadline}/>
        </label>     
        <br />                   
        <input type="submit" className="" value="add" />
    </form>
        {/* 展示todo list的部分 */}
    <ul className="List-item">
        {items1.map((item, index:number) => {
            return (
                <div key={index} >
                    <input type="button" name="" value="删除"  onClick={()=>deleteItem(index)} />        
                <Item  itemValue={item.text} itemDeadline={item.time } itemIndex={index} 
                    updateDesc={updateDesc} updateDeadline={updateDeadline}
                />
                </div>   
            )
        })
        }
    </ul> 
</div>)
 
}


interface ItemProp{
    itemValue: string;
    itemDeadline:string;
    itemIndex:number;
    updateDesc:(index:number,desc:string)=>void
    updateDeadline :(index:number,deadline:string)=>void
}

function Item(props:ItemProp):JSX.Element{

    const [isChecked,setIsChecked]= useState(false)
    const {itemValue,itemDeadline,itemIndex,updateDesc,updateDeadline} = props
   
    return (
        <li className="item">
             <label >完成 <input type="checkbox" name="" value="" checked={isChecked}  onClick={ ()=>isChecked?setIsChecked(false):setIsChecked(true)}/></label>
    
            <span className="item-value">do:{itemValue}</span>
            <span className="item-deadline" >截止日期：{itemDeadline}</span>
            <br />
            <label >
                <input type="button" name="" value="修改desc"  onClick={()=>
                    {   const desc=prompt('修改desc')||'';
                        
                        if(desc!==''){
                        updateDesc(itemIndex,desc)}
                    }
                    
                    } />        
            </label>
            <label >
                <input type="button" name="" value="修改deadline"  onClick={()=>
                    {   const deadline=prompt('修改deadline')||'';
                        if(deadline!==''){
                        updateDeadline(itemIndex,deadline)}}
                    } />        
            </label>
            </li>
    )
}


export {TodoList} 