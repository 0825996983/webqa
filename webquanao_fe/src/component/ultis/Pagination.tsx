

interface paginationInterface{
    currentPage: number;
    totalPage: number;
    pagination: any

}



export const PaginationLink: React.FC<paginationInterface>=(props)=>{
    const listPage=[];
    if(props.currentPage===1){
        listPage.push(props.currentPage);
        if(props.totalPage >= props.currentPage+1){
            listPage.push(props.currentPage+1);
        }
        if(props.totalPage>= props.currentPage+2){
            listPage.push(props.currentPage+2);
        }
    }else if(props.currentPage>1){
        if(props.currentPage>=3){
            listPage.push(props.currentPage-2);
        }
        if(props.currentPage>=2){
            listPage.push(props.currentPage-1);
        }
        listPage.push(props.currentPage);

        if(props.totalPage >= props.currentPage +1){
            listPage.push(props.currentPage +1)
        }
        if(props.totalPage >= props.currentPage +2){
            listPage.push(props.currentPage +2)
        }
        }
    

    return(

        


        <nav aria-label="page navigation">
        <ul className="pagination">
            <li className="page-item" onClick={() => props.pagination(1)}>
                <button className="page-link">
                    Trang đầu
                </button>
            </li>
            {
                listPage.map(page => (
                    <li className="page-item" key={page} onClick={() => props.pagination(page)}>
                        <button className={"page-link " + (props.currentPage === page ? "active" : "")}>
                            {page}
                        </button>
                    </li>
                ))
            }
            <li className="page-item" onClick={() => props.pagination(props.totalPage)}>
                <button className="page-link">
                    Trang cuối
                </button>
            </li>
        </ul>
    </nav>
    

    )
}