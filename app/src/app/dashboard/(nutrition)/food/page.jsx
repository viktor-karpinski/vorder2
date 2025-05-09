import Navigation from "@/components/Navigation";
import Link from "next/link";

const Food = () => {
    return (
        <>
            <Navigation>
                <button>
                    <Link href="food/add">
                        add food
                    </Link>
                </button>
            </Navigation>
        </>
    )
}

export default Food;