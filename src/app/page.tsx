import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex-grow flex flex-col lg:flex-row items-center justify-between p-8">
            <section className="flex flex-col-reverse lg:flex-col items-center justify-center gap-4 px-4 pt-4 lg:p-4">
                <div className="bg-foreground lg:rounded-lg rounded-t-lg shadow-md text-background p-16 flex flex-col items-center justify-center gap-4 max-w-[540px] sm:w-[540px] lg:w-fit">
                    <h1 className="font-bold text-2xl">
                        Лабораторная работа №4
                    </h1>
                    <p className="text-sm">
                        Веб программирование, Университет ИТМО, 2024
                    </p>
                </div>
                <Button asChild size="lg">
                    <Link href="/panel">лессгоу</Link>
                </Button>
            </section>
            <Image
                src="/static/goida.gif"
                alt="GOIDA"
                width={540}
                height={540}
                className="rounded-b-lg lg:rounded-lg"
            />
        </div>
    );
}
