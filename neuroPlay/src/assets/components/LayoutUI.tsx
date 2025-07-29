import { CONTROL_BUTTONS, TOOL_BUTTONS } from "../../constants/buttons"
import { Logo } from "./Logo"
import { Toolbar } from "./Toolbar"

export const LayoutUI = () => {
  return (
    <div className="fixed top-4 left-4 flex flex-col gap-4 pointer-events-none">
      <Logo />
      <div className="flex flex-col gap-8 w-fit pointer-events-auto">
        <Toolbar 
          tools={TOOL_BUTTONS}
        />
        <Toolbar 
          tools={CONTROL_BUTTONS}
        />
      </div>
    </div>
  )
}