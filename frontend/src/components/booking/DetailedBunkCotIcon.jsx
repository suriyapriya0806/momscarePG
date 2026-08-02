import React from "react";

/** A warm, isometric double bunk cot used in the room bed selector. */
export const DetailedBunkCotIcon = ({ className = "w-32 h-32" }) => (
  <svg
    viewBox="0 0 260 230"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft floor shadow */}
    <ellipse cx="137" cy="207" rx="93" ry="15" fill="#78350F" opacity="0.14" />

    {/* Back/right end: tall oak posts and vertical slats */}
    <path d="M191 27 204 33v151l-13 7Z" fill="#78350F" />
    <path d="M204 33 211 30v151l-7 3Z" fill="#92400E" />
    <path d="M181 43 190 47v137l-9 5Z" fill="#B45309" />
    <path d="M183 51 183 178M191 52 191 174M198 43 198 171" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.85" />

    {/* Lower bed support and roomy storage drawer panel */}
    <path d="M54 169 166 128l38 18-112 44Z" fill="#92400E" />
    <path d="M54 169 92 190v18l-38-20Z" fill="#78350F" />
    <path d="M92 190 204 146v18L92 208Z" fill="#B45309" />
    <path d="M101 189 190 154v15l-89 35Z" fill="#A64B10" />
    <path d="M102 190 190 155" stroke="#F59E0B" strokeWidth="1.6" opacity="0.65" />
    <path d="M139 183 151 178" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />

    {/* Lower mattress: top, front thickness and side */}
    <path d="M58 132 163 92l36 18-105 42Z" fill="#FFFFFF" />
    <path d="M58 132 94 152v16l-36-19Z" fill="#DCE3E8" />
    <path d="M94 152 199 110v16L94 168Z" fill="#E8EDF0" />
    <path d="M64 133 163 96l29 14-98 39Z" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.8" />
    <path d="M83 144 173 108" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />

    {/* Lower folded white pillow, tucked at the rear */}
    <path d="M133 105 161 94l24 12-29 12-23-13Z" fill="#FFFFFF" />
    <path d="M156 118 185 106v8l-29 12Z" fill="#E2E8F0" />
    <path d="M139 105 160 98" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Warm shadow in the lower sleeping area */}
    <path d="M73 129 161 96l26 13-89 35Z" fill="#78350F" opacity="0.1" />

    {/* Front lower posts */}
    <path d="M54 94 66 100v103l-12 6Z" fill="#78350F" />
    <path d="M66 100 72 97v103l-6 3Z" fill="#B45309" />
    <path d="M165 52 177 58v129l-12 6Z" fill="#92400E" />
    <path d="M177 58 183 55v129l-6 3Z" fill="#D97706" />

    {/* Upper bed wooden frame */}
    <path d="M54 98 163 56l37 19-109 43Z" fill="#92400E" />
    <path d="M54 98 91 118v13L54 111Z" fill="#78350F" />
    <path d="M91 118 200 75v13L91 131Z" fill="#B45309" />

    {/* Upper thick mattress */}
    <path d="M59 72 164 31l36 19-105 42Z" fill="#FFFFFF" />
    <path d="M59 72 95 92v17L59 89Z" fill="#DCE3E8" />
    <path d="M95 92 200 50v17L95 109Z" fill="#E7ECEF" />
    <path d="M65 73 164 35l29 15-98 39Z" stroke="#CBD5E1" strokeWidth="1.5" />
    <path d="M83 84 174 48" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />

    {/* Upper folded white pillow */}
    <path d="M134 44 161 33l25 13-29 12-23-14Z" fill="#FFFFFF" />
    <path d="M157 58 186 46v8l-29 12Z" fill="#E2E8F0" />
    <path d="M140 44 161 37" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Upper safety rail: oak rails and evenly spaced balusters */}
    <path d="M55 48 163 7l37 19-108 43Z" stroke="#92400E" strokeWidth="6" strokeLinejoin="round" />
    <path d="M55 67 163 25l37 19-108 43Z" stroke="#B45309" strokeWidth="5" strokeLinejoin="round" />
    <path d="M69 43v20M91 35v20M113 26v20M135 18v20M157 10v20M178 19v20" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
    <path d="M57 47 164 6" stroke="#D97706" strokeWidth="1.5" opacity="0.9" />

    {/* Right end rails/slats keep both berths visibly enclosed */}
    <path d="M198 27v39M198 76v33M198 119v28" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
    <path d="M177 58 204 72M177 88 204 102M177 143 204 157" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />

    {/* Four-step front ladder, deliberately in front of the cot */}
    <path d="M103 91 103 202M130 80 130 191" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
    <path d="M104 109 130 98M104 132 130 121M104 155 130 144M104 178 130 167" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
    <path d="M106 108 128 99M106 131 128 122M106 154 128 145M106 177 128 168" stroke="#F59E0B" strokeWidth="1.3" opacity="0.75" />

    {/* Finial highlights */}
    <path d="M52 94 60 90l12 7-8 4ZM163 52l8-4 12 7-8 4ZM191 27l8-4 12 7-8 4Z" fill="#F59E0B" />
  </svg>
);

export default DetailedBunkCotIcon;
