import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Navigation, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WarehouseCardProps {
  name?: string;
  location?: string;
  distance?: string;
  capacity?: string;
  price?: string;
  type?: "warehouse" | "marketplace";
  isSelected?: boolean;
  onNavigate?: () => void;
  onClick?: () => void;
}

export function WarehouseCard({
  name = "Nearest Cold Storage",
  location = "Based on your current location",
  distance,
  capacity = "450 Tons",
  price = "₹20",
  type = "warehouse",
  isSelected = false,
  onNavigate,
  onClick,
}: WarehouseCardProps) {
  return (
    <Card
      className={cn(
        "border-border/60 shadow-sm h-full flex flex-col card-hover cursor-pointer transition-all duration-300",
        isSelected && "border-orange-500/40 shadow-orange-500/10 shadow-md bg-orange-500/[0.03]"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PackageSearch className={cn("h-4 w-4", type === "marketplace" ? "text-blue-500" : "text-orange-500")} />
          {name}
        </CardTitle>
        <CardDescription className="text-xs">
          {location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="bg-muted/20 rounded-xl p-4 mb-auto border border-border/40">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm text-foreground">{name}</h4>
              {distance && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" /> {distance} away
                </div>
              )}
            </div>
            {type && (
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                type === "warehouse" ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
              )}>
                {type === "warehouse" ? "Warehouse" : "Mandi"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/40">
            <div>
              <p className="text-[11px] text-muted-foreground">
                {type === "warehouse" ? "Available Space" : "Market Type"}
              </p>
              <p className="font-bold text-base text-gradient">{capacity}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">
                {type === "warehouse" ? "Rental Price" : "Entry"}
              </p>
              <p className="font-bold text-base text-foreground">
                {price}
                {type === "warehouse" && <span className="text-[10px] font-normal text-muted-foreground">/qtl/mo</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs h-9 shadow-sm shadow-orange-500/10 hover:shadow-md transition-all"
            size="sm"
            onClick={(e) => { e.stopPropagation(); }}
          >
            {type === "warehouse" ? "Reserve Space" : "View Market"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 rounded-xl h-9 border-border/60"
            onClick={(e) => { e.stopPropagation(); onNavigate?.(); }}
          >
            <Navigation className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
