import {animate, motion} from 'framer-motion';

// variants
const stairAnimation = {
    initial:{
        top:"0%",
    },
    animate :{
        top:"100%",
    },
    exit:{
        top: ["100%","0%"],
    }
}

const reverseIndex=(index)=>{
    const totalSteps=6;
    return totalSteps - index-1;
}
const Stairs = () => {
  return (
    // render & motion divs
    <>
        {[...Array(6)].map((_, index) => (
            <motion.div
            key={index}
            className="w-full h-full bg-foreground relative left-0"
            style={{ zIndex: reverseIndex(index) }}
            variants={stairAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                duration: 0.4,
                ease: "easeInOut",
                delay: reverseIndex(index) * 0.1,
            }}
            />
        ))}
    </>
  )
}

export default Stairs
