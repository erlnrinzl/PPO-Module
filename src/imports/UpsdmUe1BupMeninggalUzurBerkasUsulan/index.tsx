import svgPaths from "./svg-x8r0wrzwge";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f59e0b] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16.25px] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">HRIS Kemenkeu</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] not-italic relative shrink-0 text-[10px] text-[rgba(190,219,255,0.7)] whitespace-nowrap">Modul PPO</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-[97.571px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#1e3a8a] min-h-[56px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center min-h-[inherit] px-[16px] py-[12px] relative size-full">
          <Container1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#99a1af] text-[10px] tracking-[1px] uppercase whitespace-nowrap">Alur Proses</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p16dcb0} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p29a9aa00} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p9f2bd80} id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p13c0200} id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[17px] relative shrink-0 w-[161.429px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[2px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Monitoring</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[161.429_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container5 />
      <Container6 />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p317fdd80} id="Vector" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p31c78b80} id="Vector_2" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3625bb80} id="Vector_3" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2ca18b80} id="Vector_4" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[17px] relative shrink-0 w-[133.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[2px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">BUP / Meninggal / Uzur</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[133.67_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container10 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#f97316] h-[19px] relative rounded-[19174000px] shrink-0 w-[17.759px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[6px] not-italic text-[10px] text-white top-[1.57px] whitespace-nowrap">7</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container8 />
      <Container9 />
      <Text />
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="bg-[#eff6ff] relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p11db07c0} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[17px] relative shrink-0 w-[133.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[2px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Pemberhentian Tewas</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[133.67_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container13 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#ef4444] h-[19px] relative rounded-[19174000px] shrink-0 w-[17.759px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[6px] not-italic text-[10px] text-white top-[1.57px] whitespace-nowrap">2</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container11 />
      <Container12 />
      <Text1 />
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button2 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2208_710)" id="Icon">
          <path d={svgPaths.p2cd5ea80} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.16667 11.6667H2.91667" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7.58333 11.6667H12.8333" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 7V7.00583" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3c4c0b80} id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2208_710">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[17px] relative shrink-0 w-[133.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[2px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Pengunduran Diri</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[133.67_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container16 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#8b5cf6] h-[19px] relative rounded-[19174000px] shrink-0 w-[17.759px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[6px] not-italic text-[10px] text-white top-[1.57px] whitespace-nowrap">4</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container14 />
      <Container15 />
      <Text2 />
    </div>
  );
}

function ButtonMargin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button3 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p8cdb700} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.25 12.25L9.74167 9.74167" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Pegawai Hilang / Ditemukan</p>
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Container19 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[133.67_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ContainerMargin />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#6b7280] h-[19px] relative rounded-[19174000px] shrink-0 w-[17.759px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[6px] not-italic text-[10px] text-white top-[1.57px] whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container17 />
      <Container18 />
      <Text3 />
    </div>
  );
}

function ButtonMargin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button4 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p4946c00} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pca61480} id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">{`Verifikasi & Penetapan SK`}</p>
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Container22 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[133.67_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ContainerMargin1 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#2563eb] h-[19px] relative rounded-[19174000px] shrink-0 w-[17.759px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[6px] not-italic text-[10px] text-white top-[1.57px] whitespace-nowrap">5</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container20 />
      <Container21 />
      <Text4 />
    </div>
  );
}

function ButtonMargin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button5 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2b8747f0} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 1.16667V3.5" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H4.66667" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p298bef00} id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1aac1300} id="Vector_6" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Masa Persiapan Pensiun</p>
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Container25 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[133.67_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ContainerMargin2 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[#059669] h-[19px] relative rounded-[19174000px] shrink-0 w-[17.759px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[6px] not-italic text-[10px] text-white top-[1.57px] whitespace-nowrap">9</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative rounded-[10px] shrink-0 w-[219.429px]" data-name="Button">
      <Container23 />
      <Container24 />
      <Text5 />
    </div>
  );
}

function ButtonMargin6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[2px] relative size-full">
        <Button6 />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[797.571_0_0] min-h-px relative w-full" data-name="Navigation">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[10px] py-[12px] relative size-full">
          <Paragraph />
          <ButtonMargin />
          <ButtonMargin1 />
          <ButtonMargin2 />
          <ButtonMargin3 />
          <ButtonMargin4 />
          <ButtonMargin5 />
          <ButtonMargin6 />
        </div>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#d1d5dc] text-[10px] text-center whitespace-nowrap">© 2024 Kemenkeu RI · v2.1.0</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-solid border-t-[0.571px] inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] pt-[12.571px] px-[16px] relative size-full">
        <Paragraph1 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[77.063px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(190,219,255,0.7)] top-[-0.43px] whitespace-nowrap">HRIS Kemenkeu</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
          <path d={svgPaths.p1a78e480} id="Vector" stroke="var(--stroke-0, #BEDBFF)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[55.321px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(190,219,255,0.7)] top-[-0.43px] whitespace-nowrap">Modul PPO</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
          <path d={svgPaths.p1a78e480} id="Vector" stroke="var(--stroke-0, #BEDBFF)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[32.429px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[#dbeafe] text-[11px] top-[-0.43px] whitespace-nowrap">Flow 2</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Text6 />
        <Icon8 />
        <Text7 />
        <Icon9 />
        <Text8 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[24px] relative shrink-0 w-[3.83px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(142,197,255,0.5)] top-[-1.86px] whitespace-nowrap">|</p>
    </div>
  );
}

function TextMargin() {
  return (
    <div className="relative shrink-0" data-name="Text (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[4px] relative size-full">
        <Text9 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[306.848px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-0 not-italic text-[13px] text-white top-[-0.43px] whitespace-nowrap">Usulan Pemberhentian karena BUP, Meninggal, Uzur</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-[545.491px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container29 />
        <TextMargin />
        <Text10 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[18px] relative shrink-0 w-[33.589px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[17.5px] not-italic text-[#bedbff] text-[12px] text-center top-[-0.43px] whitespace-nowrap">Peran:</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[18px] relative shrink-0 w-[89.786px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[45.5px] not-italic text-[12px] text-center text-white top-[-0.43px] whitespace-nowrap">Unit SDM UE1</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="Icon">
          <path d={svgPaths.pa029e20} id="Vector" stroke="var(--stroke-0, #BEDBFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[31.143px] relative rounded-[10px] shrink-0 w-[177.518px]" data-name="Button">
      <div aria-hidden className="absolute border-[0.571px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12.571px] py-[6.571px] relative size-full">
        <Text11 />
        <Text12 />
        <Icon10 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="Icon">
          <path d={svgPaths.p12c36f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41667" />
          <path d={svgPaths.p11013580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41667" />
        </g>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute bg-[#fb2c36] left-[16px] rounded-[19174000px] size-[16px] top-[4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[13.5px] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">3</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
        <Text13 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="Icon">
          <path d={svgPaths.p4b61000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41667" />
          <path d={svgPaths.p27765100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41667" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[#1d4ed8] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">HP</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Hadi Purnomo</p>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] not-italic relative shrink-0 text-[10px] text-[rgba(190,219,255,0.7)] whitespace-nowrap">NIP: 197112251997031004</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-[117.688px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.2)] border-l-[0.571px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center pl-[12.571px] relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button7 />
        <Button8 />
        <Button9 />
        <Container31 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#1e40af] h-[56px] relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Container28 />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pd2eb480} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p19685c00} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p226d9800} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2a5062c0} id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin() {
  return (
    <div className="relative shrink-0" data-name="Icon (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pt-[2px] relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#193cb8] text-[14px] whitespace-nowrap">Usulan Pemberhentian — BUP, Meninggal, Uzur</p>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[18px] relative shrink-0 w-[684.295px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] whitespace-nowrap">Kelola usulan pemberhentian dan buat berkas konsolidasi usulan untuk diajukan ke Biro SDM Kemenkeu.</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-[684.295px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph4 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#bedbff] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start p-[16.571px] relative size-full">
        <IconMargin />
        <Container35 />
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="bg-[#dbeafe] content-stretch flex items-center justify-center px-[5px] py-px relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14.286px] not-italic relative shrink-0 text-[#1447e6] text-[10px] text-center whitespace-nowrap">3</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] h-full relative rounded-[10px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1e2939] text-[14px] text-center whitespace-nowrap">Berkas Usulan Masuk</p>
          <Text14 />
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-full relative rounded-[10px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[14px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-center whitespace-nowrap">Siap Kirim</p>
        </div>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex items-center justify-center px-[5px] py-px relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14.286px] not-italic relative shrink-0 text-[#008236] text-[10px] text-center whitespace-nowrap">0</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-full relative rounded-[10px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center justify-center px-[18px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-center whitespace-nowrap">Arsip</p>
          <Text15 />
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex gap-[4px] h-[48px] items-start p-[4px] relative rounded-[14px] shrink-0" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="relative shrink-0" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <Container36 />
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[124.598px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#1e2939] text-[14px] top-[-0.43px] whitespace-nowrap">Filter Berkas Usulan</p>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="h-[16px] relative shrink-0 w-[29.42px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[15.5px] not-italic text-[#155dfc] text-[12px] text-center top-0 whitespace-nowrap">Reset</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Paragraph6 />
        <Button13 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Pencarian</p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p8cdb700} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.25 12.25L9.74167 9.74167" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[930_0_0] h-[16px] min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[12px] w-full">Cari nomor usulan, nama berkas...</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#e5e7eb] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12.571px] py-[8.571px] relative size-full">
          <Icon14 />
          <TextInput />
        </div>
      </div>
    </div>
  );
}

function ContainerMargin6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[6px] relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[977.143px]" data-name="Container">
      <Label />
      <ContainerMargin6 />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[22px] relative shrink-0 w-[235.286px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Jenis</p>
      </div>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="h-[34.286px] relative rounded-[14px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden className="absolute border-[#e5e7eb] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[67.14px] w-[235.286px]" data-name="Container">
      <Label1 />
      <Dropdown />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[22px] relative shrink-0 w-[235.286px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Status</p>
      </div>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="h-[34.286px] relative rounded-[14px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden className="absolute border-[#e5e7eb] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[247.29px] top-[67.14px] w-[235.286px]" data-name="Container">
      <Label2 />
      <Dropdown1 />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[22px] relative shrink-0 w-[235.286px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Tanggal Dibuat</p>
      </div>
    </div>
  );
}

function DatePicker() {
  return <div className="absolute border-[#e5e7eb] border-[0.571px] border-solid h-[33.143px] left-0 rounded-[14px] top-0 w-[235.286px]" data-name="Date Picker" />;
}

function InlineContent() {
  return (
    <div className="h-[34.286px] relative shrink-0 w-full" data-name="Inline content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <DatePicker />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[494.57px] top-[67.14px] w-[235.286px]" data-name="Container">
      <Label3 />
      <InlineContent />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[123.429px] relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container42 />
      <Container43 />
      <Container44 />
    </div>
  );
}

function ContainerMargin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <Container39 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start p-[20.571px] relative size-full">
        <Container38 />
        <ContainerMargin5 />
      </div>
    </div>
  );
}

function ContainerMargin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <Container37 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">2 Usulan dipilih</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M9.33333 9.33333H12.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.0833 7.58333V11.0833" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p14ed2380} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.375 2.49083L9.625 5.495" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p21a6a770} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 12.8333V7" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[14px] shrink-0" data-name="Button">
      <Icon15 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Buat Paket Konsolidasi</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p34aacb00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p27169580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 8.75V1.75" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[14px] shrink-0" data-name="Button">
      <Icon16 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">{` Export Excel`}</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Button14 />
      <Button15 />
    </div>
  );
}

function Container45() {
  return (
    <div className="bg-[#162d54] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-[22px] relative size-full">
          <Paragraph7 />
          <Frame />
        </div>
      </div>
    </div>
  );
}

function ContainerMargin7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <Container45 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] not-italic relative shrink-0 text-[#1e2939] text-[18px] whitespace-nowrap">Berkas Usulan Masuk</p>
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[18px] relative shrink-0 w-[157.946px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">3 berkas aktif</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 w-[157.946px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[65px] relative shrink-0 w-[1018.286px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-[20px] relative size-full">
        <Container47 />
      </div>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Checkbox">
      <div aria-hidden className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[20px]">
      <Checkbox />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-center relative self-stretch shrink-0 w-[140px]">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Nomor Usulan</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center justify-center relative self-stretch shrink-0 w-[110px]">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Nama Berkas</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[130px]">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Satker Pengusul</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Jenis</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Catatan</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="bg-[#f9fafb] relative shrink-0 w-full" data-name="Table Row">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.571px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start px-[16px] py-[12px] relative size-full">
        <Frame12 />
        <Frame13 />
        <Frame14 />
        <Frame15 />
        <Frame16 />
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-center w-[160px]">Jumlah Pegawai</p>
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Status</p>
        <Frame19 />
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Aksi</p>
      </div>
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Checkbox">
      <div aria-hidden className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0 w-[34px]">
      <Checkbox1 />
    </div>
  );
}

function TableCell() {
  return (
    <div className="[word-break:break-word] h-[58px] leading-[16px] not-italic relative shrink-0 text-[12px] w-[125px] whitespace-nowrap" data-name="Table Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[#1e2939] top-[12.29px]">USP-2027-001</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[#99a1af] top-[30.29px]">02 Jan 2027</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[110px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">BUP Januari 2027</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[130px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">KPP Pratama Bandung</p>
    </div>
  );
}

function Text16() {
  return (
    <div className="bg-[#2563eb] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">BUP</p>
    </div>
  );
}

function Text17() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1e2939] text-[12px] whitespace-nowrap">35 pegawai</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[12px] relative shrink-0 w-[54.357px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[12px] left-0 not-italic text-[#00a63e] text-[9px] top-0 whitespace-nowrap">✓ 35 lengkap</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text18 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Container">
      <Text17 />
      <Container51 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex h-full items-center px-[16px] relative shrink-0 w-[130px]">
      <Container50 />
    </div>
  );
}

function Text19() {
  return (
    <div className="bg-[#8b5cf6] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">Diajukan ke UE1</p>
    </div>
  );
}

function Frame20() {
  return <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative" />;
}

function QlementineIconsMenuDots() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="qlementine-icons:menu-dots-16">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="qlementine-icons:menu-dots-16">
          <path d={svgPaths.p260dd400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="bg-[#162d54] relative rounded-[14px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center p-[6px] relative size-full">
        <QlementineIconsMenuDots />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Button16 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table Row">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center px-[16px] relative size-full">
          <div className="flex flex-row items-center self-stretch">
            <Frame6 />
          </div>
          <TableCell />
          <div className="flex flex-row items-center self-stretch">
            <Frame4 />
          </div>
          <div className="flex flex-row items-center self-stretch">
            <Frame5 />
          </div>
          <Text16 />
          <div className="flex flex-row items-center self-stretch">
            <Frame11 />
          </div>
          <Text19 />
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <Frame20 />
          </div>
          <Container52 />
        </div>
      </div>
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Checkbox">
      <div aria-hidden className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0 w-[34px]">
      <Checkbox2 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="[word-break:break-word] h-[59px] leading-[16px] not-italic relative shrink-0 text-[12px] w-[125px] whitespace-nowrap" data-name="Table Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[#1e2939] top-[12.29px]">USP-2027-002</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[#99a1af] top-[30.29px]">01 Feb 2027</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[110px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">BUP Februari 2027</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0 w-[130px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">KPP Pratama Jakarta</p>
    </div>
  );
}

function Text20() {
  return (
    <div className="bg-[#2563eb] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">BUP</p>
    </div>
  );
}

function Text21() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1e2939] text-[12px] whitespace-nowrap">22 pegawai</p>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[12px] relative shrink-0 w-[54.357px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[12px] left-0 not-italic text-[#00a63e] text-[9px] top-0 whitespace-nowrap">✓ 22 lengkap</p>
      </div>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[12px] relative shrink-0 w-[48.098px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[12px] left-0 not-italic text-[#e7000b] text-[9px] top-0 whitespace-nowrap">⚠ 3 belum</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text22 />
        <Text23 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Container">
      <Text21 />
      <Container54 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex h-full items-center px-[16px] relative shrink-0 w-[130px]">
      <Container53 />
    </div>
  );
}

function Text24() {
  return (
    <div className="bg-[#e7000b] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">Perlu Revisi Satker</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[93px]">
      <Text24 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[#99a1af] text-[10px] whitespace-nowrap">Berkas digital rusak</p>
    </div>
  );
}

function QlementineIconsMenuDots1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="qlementine-icons:menu-dots-16">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="qlementine-icons:menu-dots-16">
          <path d={svgPaths.p260dd400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-[#162d54] relative rounded-[14px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center p-[6px] relative size-full">
        <QlementineIconsMenuDots1 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Button17 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table Row">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center px-[16px] relative size-full">
          <div className="flex flex-row items-center self-stretch">
            <Frame7 />
          </div>
          <TableCell1 />
          <div className="flex flex-row items-center self-stretch">
            <Frame9 />
          </div>
          <div className="flex flex-row items-center self-stretch">
            <Frame10 />
          </div>
          <Text20 />
          <div className="flex flex-row items-center self-stretch">
            <Frame17 />
          </div>
          <Frame1 />
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <Frame21 />
          </div>
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function Checkbox3() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Checkbox">
      <div aria-hidden className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[34px]">
      <Checkbox3 />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[16px] not-italic px-[16px] py-[12px] relative shrink-0 text-[12px] w-[125px]" data-name="Table Cell">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#1e2939] w-full">USP-2027-003</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#99a1af] w-full">15 Mar 2027</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0 w-[110px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">Uzur Triwulan I</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0 w-[130px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">KPP Pratama Bintan</p>
    </div>
  );
}

function Text25() {
  return (
    <div className="bg-[#7c3aed] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">Uzur</p>
    </div>
  );
}

function Text26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1e2939] text-[12px] whitespace-nowrap">5 pegawai</p>
      </div>
    </div>
  );
}

function Text27() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[12px] not-italic relative shrink-0 text-[#00a63e] text-[9px] whitespace-nowrap">✓ 5 lengkap</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text27 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Container">
      <Text26 />
      <Container57 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex h-full items-center px-[16px] relative shrink-0 w-[130px]">
      <Container56 />
    </div>
  );
}

function Text28() {
  return (
    <div className="bg-[#ec4899] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[19174000px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.333px] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">Review UE1</p>
    </div>
  );
}

function Frame22() {
  return <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative" />;
}

function QlementineIconsMenuDots2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="qlementine-icons:menu-dots-16">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="qlementine-icons:menu-dots-16">
          <path d={svgPaths.p260dd400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="bg-[#162d54] relative rounded-[14px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center p-[6px] relative size-full">
        <QlementineIconsMenuDots2 />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Button18 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center px-[16px] relative size-full">
          <Frame8 />
          <TableCell2 />
          <div className="flex flex-row items-center self-stretch">
            <Frame2 />
          </div>
          <div className="flex flex-row items-center self-stretch">
            <Frame3 />
          </div>
          <Text25 />
          <div className="flex flex-row items-center self-stretch">
            <Frame18 />
          </div>
          <Text28 />
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <Frame22 />
          </div>
          <Container58 />
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TableRow />
        <TableRow1 />
        <TableRow2 />
        <TableRow3 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="bg-white h-[216.857px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.571px] relative rounded-[inherit] size-full">
        <Container49 />
      </div>
      <div aria-hidden className="absolute border-[#f3f4f6] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ContainerMargin8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <Container48 />
      </div>
    </div>
  );
}

function FlowBup() {
  return (
    <div className="relative shrink-0 w-full" data-name="FlowBUP">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Container34 />
        <ContainerMargin3 />
        <ContainerMargin4 />
        <ContainerMargin7 />
        <Container46 />
        <ContainerMargin8 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[837.143_0_0] min-h-px relative w-full" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <FlowBup />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1066.286_0_0] h-full min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#eef2f7] h-[893.143px] relative shrink-0 w-[1306.286px]" data-name="App">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="bg-white h-[893.143px] relative shrink-0 w-[240px]" data-name="Sidebar">
          <div aria-hidden className="absolute border-[#e5e7eb] border-r-[0.571px] border-solid inset-0 pointer-events-none" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[0.571px] relative size-full">
            <Container />
            <Navigation />
            <Container26 />
          </div>
        </div>
        <Container27 />
      </div>
    </div>
  );
}

export default function UpsdmUe1BupMeninggalUzurBerkasUsulan() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="UPSDM UE1 - BUP/Meninggal/Uzur-Berkas Usulan">
      <App />
    </div>
  );
}